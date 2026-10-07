import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { renderInvoicePdf } from "../../../lib/teacher-invoice/InvoicePdf";
import { invoiceEmailHtml, invoiceEmailText, invoiceFilename, invoiceSubject } from "../../../lib/teacher-invoice/email";
import { DEFAULT_TO, canCopyTeacher, mailFrom, mailTo, resendApiKey } from "../../../lib/teacher-invoice/mail-config";
import { normalise, todayISO, validate } from "../../../lib/teacher-invoice/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Privacy: this route stores nothing. The submitted details exist only for the
 * length of this request, go into one PDF and one email to the school, and are
 * never logged. It never returns anyone's details, so no teacher can see another's.
 */

// Best-effort throttles, per IP. On serverless each instance keeps its own
// counters, so these slow down abuse rather than guarantee a hard limit.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_WRONG_CODES = 10; // guessing the team code
const MAX_SENDS = 40; // generous: teachers at one pool can share an IP
const wrongCodes = new Map<string, { count: number; reset: number }>();
const sends = new Map<string, { count: number; reset: number }>();

function over(map: Map<string, { count: number; reset: number }>, ip: string, max: number) {
  const a = map.get(ip);
  return !!a && a.reset > Date.now() && a.count >= max;
}
function bump(map: Map<string, { count: number; reset: number }>, ip: string) {
  const now = Date.now();
  const a = map.get(ip);
  if (!a || a.reset < now) map.set(ip, { count: 1, reset: now + WINDOW_MS });
  else a.count += 1;
  if (map.size > 5000) for (const [k, v] of map) if (v.reset < now) map.delete(k);
}

function codeMatches(given: string) {
  const expected = process.env.TEACHER_INVOICE_ACCESS_CODE ?? "";
  if (!expected) return false;
  const a = Buffer.from(given.trim());
  const b = Buffer.from(expected.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

const fail = (status: number, error: string, fields?: Record<string, string | undefined>) =>
  NextResponse.json({ ok: false, error, fields }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (over(wrongCodes, ip, MAX_WRONG_CODES) || over(sends, ip, MAX_SENDS)) {
    return fail(429, "Too many attempts. Wait 15 minutes and try again.");
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Something was wrong with the form data. Refresh the page and try again.");
  }

  // Honeypot: real people never fill this in.
  if (typeof body?.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });

  if (!process.env.TEACHER_INVOICE_ACCESS_CODE) {
    console.error("[teacher-invoice] TEACHER_INVOICE_ACCESS_CODE is not set");
    return fail(500, `Invoices can't be sent right now. Email your invoice to ${DEFAULT_TO} instead.`);
  }
  if (!codeMatches(String(body?.accessCode ?? ""))) {
    bump(wrongCodes, ip);
    return fail(401, "That team code isn't right. Check it with the office.", { accessCode: "Check the team code." });
  }

  const inv = normalise(body?.invoice);
  if (!inv) return fail(400, "Something was wrong with the form data. Refresh the page and try again.");
  const errors = validate(inv);
  if (Object.keys(errors).length) return fail(422, "Some details need fixing before this can be sent.", errors);

  const apiKey = resendApiKey();
  if (!apiKey) {
    console.error("[teacher-invoice] RESEND_API_KEY is not set");
    return fail(500, `Invoices can't be sent right now. Email your invoice to ${DEFAULT_TO} instead.`);
  }

  const from = mailFrom();
  const copyTeacher = canCopyTeacher(from);
  const dateSent = todayISO();
  bump(sends, ip);

  try {
    const pdf = await renderInvoicePdf(inv, dateSent);
    // Resend's REST API directly, so this works whatever version of the
    // `resend` package (if any) the rest of the site uses.
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: mailTo(),
        ...(copyTeacher ? { cc: [inv.email] } : {}),
        reply_to: inv.email,
        subject: invoiceSubject(inv),
        html: invoiceEmailHtml(inv, dateSent),
        text: invoiceEmailText(inv, dateSent),
        attachments: [{ filename: invoiceFilename(inv), content: pdf.toString("base64") }],
      }),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      // Resend's own error message only, never the submitted details.
      throw new Error(`Resend ${res.status}: ${detail?.message ?? detail?.name ?? "unknown error"}`);
    }
  } catch (err) {
    console.error("[teacher-invoice] send failed:", err instanceof Error ? err.message : "unknown");
    return fail(502, `Your invoice didn't send. Try again in a minute, or email it to ${DEFAULT_TO} instead.`);
  }

  return NextResponse.json(
    { ok: true, copied: copyTeacher },
    { headers: { "Cache-Control": "no-store" } },
  );
}
