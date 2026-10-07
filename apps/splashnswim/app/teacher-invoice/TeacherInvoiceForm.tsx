"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SCHOOLS,
  SCHOOL_IDS,
  getSchool,
  type Errors,
  type TeacherInvoice,
  type WorkedDay,
  cleanDigits,
  formatDateSent,
  formatDayLong,
  formatDuration,
  formatMoney,
  formatMonth,
  formatNi,
  formatSortCode,
  invoiceRef,
  todayISO,
  totalDue,
  totalMinutes,
  validate,
} from "../../lib/teacher-invoice/schema";
import styles from "./teacher-invoice.module.css";

/*
 * Privacy: everything a teacher types lives only in this component's memory.
 * Nothing is written to cookies, localStorage, the URL or the server (until
 * they press Send, and then it goes straight into an email). The form is wiped:
 *  - as soon as the invoice is sent
 *  - when they press "Clear form"
 *  - after 15 minutes without any activity (a phone or laptop left unattended)
 *  - when the page is left, or restored from the browser's back/forward cache
 * Browser autofill is switched off so details aren't saved to a shared device.
 */

type Stage = "form" | "preview" | "sent";

const IDLE_LIMIT_MS = 15 * 60 * 1000;
const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const pad = (n: number) => String(n).padStart(2, "0");

function defaultMonth() {
  // Early in the month people are usually invoicing for the month just gone.
  const [y, m, d] = todayISO().split("-").map(Number);
  if (d <= 10) {
    const prev = new Date(Date.UTC(y, m - 2, 1));
    return `${prev.getUTCFullYear()}-${pad(prev.getUTCMonth() + 1)}`;
  }
  return `${y}-${pad(m)}`;
}

const emptyInvoice = (): TeacherInvoice => ({
  school: "",
  name: "",
  email: "",
  address: "",
  niNumber: "",
  month: defaultMonth(),
  rate: 0,
  days: [],
  bank: { accountName: "", sortCode: "", accountNumber: "" },
});

export default function TeacherInvoiceForm({ copyToTeacher = false }: { copyToTeacher?: boolean }) {
  const [inv, setInv] = useState<TeacherInvoice>(emptyInvoice);
  const [stage, setStage] = useState<Stage>("form");
  const [errors, setErrors] = useState<Errors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ school: string; copiedTo: string; ref: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const lastMinutes = useRef(0);
  const topRef = useRef<HTMLDivElement>(null);

  // ---------- wiping ----------
  const wipe = useCallback((message: string | null = null) => {
    setInv(emptyInvoice());
    setAccessCode("");
    setHoneypot("");
    setErrors({});
    setShowErrors(false);
    setSendError(null);
    setSending(false);
    lastMinutes.current = 0;
    setNotice(message);
  }, []);

  // Idle timeout: clear the form if nobody touches it for 15 minutes.
  const hasData = !!(inv.name || inv.email || inv.address || inv.niNumber || inv.days.length || inv.rate ||
    inv.bank.accountName || inv.bank.sortCode || inv.bank.accountNumber || accessCode);
  useEffect(() => {
    if (!hasData || stage === "sent") return;
    let timer = window.setTimeout(expire, IDLE_LIMIT_MS);
    function expire() {
      wipe("The form was cleared after 15 minutes without activity, to keep your details private.");
      setStage("form");
    }
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(expire, IDLE_LIMIT_MS);
    };
    const events = ["pointerdown", "keydown", "input", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [hasData, stage, wipe]);

  // Leaving the page, or coming back via the back button, never shows old details.
  useEffect(() => {
    const onHide = () => wipe();
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        wipe();
        setStage("form");
      }
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", onShow);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", onShow);
    };
  }, [wipe]);

  useEffect(() => {
    if (showErrors) setErrors(validate(inv));
  }, [inv, showErrors]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stage]);

  // ---------- editing ----------
  const set = <K extends keyof TeacherInvoice>(k: K, v: TeacherInvoice[K]) => setInv((p) => ({ ...p, [k]: v }));
  const setBank = (k: keyof TeacherInvoice["bank"], v: string) => setInv((p) => ({ ...p, bank: { ...p.bank, [k]: v } }));

  const changeMonth = (month: string) => {
    if (inv.days.length && !confirm("Changing the month clears the days you've picked. Carry on?")) return;
    setInv((p) => ({ ...p, month, days: [] }));
  };

  // A newly picked day starts with the same time as the last one entered, so a
  // teacher who works the same shift each week only types it once.
  const toggleDay = (date: string) => {
    setInv((p) => {
      const exists = p.days.some((d) => d.date === date);
      const days = exists
        ? p.days.filter((d) => d.date !== date)
        : [...p.days, { date, minutes: lastMinutes.current }].sort((a, b) => a.date.localeCompare(b.date));
      return { ...p, days };
    });
  };

  const setDayTime = (date: string, hours: number, mins: number) => {
    const minutes = Math.max(0, Math.min(16, hours)) * 60 + mins;
    lastMinutes.current = minutes;
    setInv((p) => ({ ...p, days: p.days.map((d) => (d.date === date ? { ...d, minutes } : d)) }));
  };

  const clearForm = () => {
    if (hasData && !confirm("Clear everything you've entered?")) return;
    wipe();
    setStage("form");
  };

  // ---------- flow ----------
  const goToPreview = () => {
    setNotice(null);
    const e = validate(inv);
    setErrors(e);
    setShowErrors(true);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => {
        const first = document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error='true']");
        first?.focus();
        first?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setSendError(null);
    setStage("preview");
  };

  const send = async () => {
    if (sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/teacher-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice: inv, accessCode, website: honeypot }),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.fields && res.status === 422) {
          setErrors(data.fields);
          setShowErrors(true);
          setStage("form");
        }
        setSendError(data.error ?? "Your invoice didn't send. Try again in a minute.");
        return;
      }
      const receipt = {
        school: getSchool(inv.school)?.name ?? "",
        copiedTo: data.copied ? inv.email : "",
        ref: invoiceRef(inv),
      };
      wipe(); // nothing personal stays on screen or in memory once it's sent
      setSent(receipt);
      setStage("sent");
    } catch {
      setSendError("You seem to be offline. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const err = (k: string) => (showErrors ? errors[k] : undefined);
  const mins = totalMinutes(inv.days);

  return (
    <div className={styles.shell} ref={topRef}>
      <header className={styles.masthead}>
        <img src="/brand/logo-horizontal.png" alt="SplashNSwim" className={styles.logo} />
        <Waves />
        <h1 className={styles.title}>
          {stage === "preview" ? "Check your invoice" : stage === "sent" ? "Invoice sent" : "Send your monthly invoice"}
        </h1>
        {stage === "form" && (
          <p className={styles.lede}>
            Fill this in at the end of each month. You'll see the finished invoice before it's sent
            {copyToTeacher ? ", and you'll get a copy by email" : ""}. Nothing you enter is saved on this device.
          </p>
        )}
      </header>

      {notice && <p className={styles.notice} role="status">{notice}</p>}

      {stage === "form" && (
        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); goToPreview(); }} noValidate autoComplete="off">
          {/* Honeypot, hidden from people and screen readers */}
          <div className={styles.hp} aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
          </div>

          <section className={styles.step} aria-labelledby="s0">
            <h2 id="s0" className={styles.stepTitle}><span className={styles.stepNo}>1</span>Who you're invoicing</h2>
            <div className={styles.schools} role="radiogroup" aria-labelledby="s0"
              data-error={err("school") ? "true" : undefined} tabIndex={err("school") ? -1 : undefined}>
              {SCHOOL_IDS.map((id) => {
                const sc = SCHOOLS[id];
                return (
                  <label key={id} className={styles.schoolOption}>
                    <input type="radio" name="school" value={id} checked={inv.school === id} onChange={() => set("school", id)} />
                    <span className={styles.schoolName}>{sc.name}</span>
                    <span className={styles.schoolAddr}>{sc.legalName}, {sc.addressLines.join(", ")}</span>
                  </label>
                );
              })}
            </div>
            {err("school") && <p className={styles.error}>{err("school")}</p>}
          </section>

          <section className={styles.step} aria-labelledby="s1">
            <h2 id="s1" className={styles.stepTitle}><span className={styles.stepNo}>2</span>About you</h2>
            <Field label="Full name" error={err("name")}>
              <input autoComplete="off" value={inv.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err("name")} />
            </Field>
            <Field label="Email" hint={copyToTeacher ? "We'll send a copy of your invoice here." : "So the office can reply about your invoice."} error={err("email")}>
              <input type="email" autoComplete="off" inputMode="email" value={inv.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")} />
            </Field>
            <Field label="Address" error={err("address")}>
              <textarea rows={3} autoComplete="off" value={inv.address} onChange={(e) => set("address", e.target.value)} aria-invalid={!!err("address")} />
            </Field>
            <Field label="National Insurance number" hint="For example, AB 12 34 56 C" error={err("niNumber")}>
              <input autoComplete="off" autoCapitalize="characters" spellCheck={false} className={styles.short} value={inv.niNumber}
                onChange={(e) => set("niNumber", e.target.value.toUpperCase())}
                onBlur={(e) => set("niNumber", formatNi(e.target.value))} aria-invalid={!!err("niNumber")} />
            </Field>
          </section>

          <section className={styles.step} aria-labelledby="s2">
            <h2 id="s2" className={styles.stepTitle}><span className={styles.stepNo}>3</span>Days and hours</h2>
            <div className={styles.pair}>
              <Field label="Month you're invoicing for" error={err("month")}>
                <input type="month" value={inv.month} onChange={(e) => e.target.value && changeMonth(e.target.value)} />
              </Field>
              <Field label="Hourly rate" error={err("rate")}>
                <span className={styles.money}>
                  <span aria-hidden="true">£</span>
                  <input type="number" inputMode="decimal" min={1} max={200} step={0.01} placeholder="0.00" autoComplete="off"
                    value={inv.rate || ""} onChange={(e) => set("rate", e.target.value === "" ? 0 : Number(e.target.value))}
                    aria-invalid={!!err("rate")} />
                </span>
              </Field>
            </div>

            <p className={styles.help}>Tap each day you worked, then set how long you worked that day.</p>
            <Calendar month={inv.month} days={inv.days} onToggle={toggleDay} />

            {inv.days.length > 0 && (
              <ul className={styles.dayList} aria-label="Time worked each day">
                {inv.days.map((d) => {
                  const h = Math.floor(d.minutes / 60);
                  const m = d.minutes % 60;
                  const day = formatDayLong(d.date);
                  const bad = showErrors && !(d.minutes > 0);
                  return (
                    <li key={d.date} className={styles.dayRow}>
                      <span className={styles.dayName}>{day}</span>
                      <span className={styles.timeField}>
                        <input type="number" inputMode="numeric" min={0} max={16} step={1} placeholder="0"
                          value={d.minutes ? h : ""} aria-label={`Hours on ${day}`} aria-invalid={bad}
                          onChange={(e) => setDayTime(d.date, e.target.value === "" ? 0 : Math.floor(Number(e.target.value)), m)} />
                        <span aria-hidden="true">h</span>
                        <select value={m} aria-label={`Minutes on ${day}`} aria-invalid={bad}
                          onChange={(e) => setDayTime(d.date, h, Number(e.target.value))}>
                          {MINUTE_OPTIONS.map((o) => <option key={o} value={o}>{pad(o)}</option>)}
                        </select>
                        <span aria-hidden="true">m</span>
                      </span>
                      <button type="button" className={styles.remove} onClick={() => toggleDay(d.date)} aria-label={`Remove ${day}`}>×</button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className={styles.totalBar} aria-live="polite">
              <div className={styles.totalCalc}>
                <span className={styles.totalMonth}>{formatMonth(inv.month)}</span>
                <span>
                  {inv.days.length} {inv.days.length === 1 ? "day" : "days"}, <b>{formatDuration(mins)}</b>
                  {inv.rate > 0 && <> at {formatMoney(inv.rate)}/hr</>}
                </span>
              </div>
              <div className={styles.totalDue}>
                <span>Total due</span>
                <strong>{formatMoney(totalDue(inv))}</strong>
              </div>
            </div>
            {err("days") && <p className={styles.error} data-error="true" tabIndex={-1}>{err("days")}</p>}
          </section>

          <section className={styles.step} aria-labelledby="s3">
            <h2 id="s3" className={styles.stepTitle}><span className={styles.stepNo}>4</span>Where to pay you</h2>
            <Field label="Name on the account" error={err("accountName")}>
              <input autoComplete="off" value={inv.bank.accountName} onChange={(e) => setBank("accountName", e.target.value)} aria-invalid={!!err("accountName")} />
            </Field>
            <div className={styles.pair}>
              <Field label="Sort code" error={err("sortCode")}>
                <input inputMode="numeric" autoComplete="off" placeholder="12-34-56" value={inv.bank.sortCode}
                  onChange={(e) => setBank("sortCode", e.target.value)}
                  onBlur={(e) => setBank("sortCode", formatSortCode(e.target.value))} aria-invalid={!!err("sortCode")} />
              </Field>
              <Field label="Account number" error={err("accountNumber")}>
                <input inputMode="numeric" autoComplete="off" maxLength={8} value={inv.bank.accountNumber}
                  onChange={(e) => setBank("accountNumber", cleanDigits(e.target.value).slice(0, 8))} aria-invalid={!!err("accountNumber")} />
              </Field>
            </div>
          </section>

          {sendError && <p className={styles.banner} role="alert">{sendError}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.textButton} onClick={clearForm}>Clear form</button>
            <button type="submit" className={styles.primary}>Preview invoice</button>
          </div>
        </form>
      )}

      {stage === "preview" && (
        <div className={styles.previewStage}>
          <InvoicePaper inv={inv} dateSent={todayISO()} />

          <div className={styles.sendPanel}>
            <Field label="Team code" hint="The code you were given. It stops anyone else sending invoices from this page.">
              <input type="password" autoComplete="off" className={styles.short} value={accessCode} onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && accessCode.trim()) send(); }} />
            </Field>
            <p className={styles.sendNote}>
              This sends your invoice to <strong>{getSchool(inv.school)?.name}</strong> for <strong>{formatMoney(totalDue(inv))}</strong>
              {copyToTeacher ? <>, with a copy to {inv.email}</> : null}.
            </p>
            {sendError && <p className={styles.banner} role="alert">{sendError}</p>}
            <div className={styles.actions}>
              <button type="button" className={styles.secondary} onClick={() => setStage("form")} disabled={sending}>Edit details</button>
              <button type="button" className={styles.primary} onClick={send} disabled={sending || !accessCode.trim()}>
                {sending ? "Sending…" : "Send invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === "sent" && sent && (
        <div className={styles.sent}>
          <img src="/brand/dylan-wave.png" alt="" className={styles.mascot} />
          <p>Your invoice to <strong>{sent.school}</strong> has been sent.{sent.copiedTo && <> A copy is on its way to <strong>{sent.copiedTo}</strong>.</>}</p>
          <p className={styles.help}>Your reference is <strong>{sent.ref}</strong>. Your details have been cleared from this page.</p>
          <p className={styles.help}>Something wrong? Email info@splashnswim.net and quote your reference.</p>
          <button type="button" className={styles.secondary} onClick={() => { setSent(null); setNotice(null); setStage("form"); }}>Send another invoice</button>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

function Calendar({ month, days, onToggle }: { month: string; days: WorkedDay[]; onToggle: (date: string) => void }) {
  const cells = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1));
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const lead = (first.getUTCDay() + 6) % 7; // Monday first
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${pad(i + 1)}`),
    ];
  }, [month]);
  const byDate = new Map(days.map((d) => [d.date, d.minutes]));
  const short = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h${pad(m)}` : `${h}h`;
  };

  return (
    <div className={styles.calendar}>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
        <span key={d} className={styles.dow} aria-hidden="true">{d}</span>
      ))}
      {cells.map((date, i) => {
        if (!date) return <span key={`b${i}`} />;
        const on = byDate.has(date);
        const min = byDate.get(date) ?? 0;
        return (
          <button key={date} type="button" className={styles.dayCell} aria-pressed={on} onClick={() => onToggle(date)}
            aria-label={`${formatDayLong(date)}${on ? `, worked${min ? ` ${formatDuration(min)}` : ""}` : ""}`}>
            <span className={styles.dayNum}>{Number(date.slice(8))}</span>
            {on && <span className={styles.dayHrs}>{min ? short(min) : "?"}</span>}
          </button>
        );
      })}
    </div>
  );
}

function InvoicePaper({ inv, dateSent }: { inv: TeacherInvoice; dateSent: string }) {
  const school = getSchool(inv.school)!;
  const isSns = school.id === "splashnswim";
  return (
    <article className={styles.paper} aria-label="Invoice preview">
      <div className={styles.paperHead}>
        {isSns ? (
          <p className={styles.wordmark} aria-label="SplashNSwim">
            <span className={styles.wmSplash}>Splash</span>
            <span className={styles.wmN}> ~ N ~ </span>
            <span className={styles.wmSwim}>Swim</span>
          </p>
        ) : (
          <p className={styles.plainName}>{school.name}</p>
        )}
        <div className={styles.paperMeta}>
          <p className={styles.paperTitle}>Invoice</p>
          <dl>
            <dt>Reference</dt><dd>{invoiceRef(inv)}</dd>
            <dt>Date sent</dt><dd>{formatDateSent(dateSent)}</dd>
            <dt>Period</dt><dd>{formatMonth(inv.month)}</dd>
          </dl>
        </div>
      </div>
      {isSns ? <Waves /> : <hr className={styles.plainRule} />}

      <div className={styles.parties}>
        <div>
          <p className={styles.paperH}>From</p>
          <p><strong>{inv.name}</strong></p>
          <p className={styles.preLine}>{inv.address}</p>
          <p className={styles.muted}>{inv.email}</p>
          <p className={styles.ni}><span className={styles.muted}>National Insurance no.</span> <strong>{formatNi(inv.niNumber)}</strong></p>
        </div>
        <div>
          <p className={styles.paperH}>To</p>
          <p><strong>{school.legalName}</strong></p>
          {school.tradingAs && <p className={styles.muted}>trading as {school.tradingAs}</p>}
          {school.addressLines.map((l) => <p key={l}>{l}</p>)}
          {school.companyNo && <p className={styles.muted}>Company no. {school.companyNo}</p>}
        </div>
      </div>

      <p className={styles.paperH}>Days worked</p>
      <table className={styles.paperTable}>
        <thead><tr><th>Date</th><th>Hours</th></tr></thead>
        <tbody>
          {inv.days.map((d) => (
            <tr key={d.date}><td>{formatDayLong(d.date)}</td><td>{formatDuration(d.minutes)}</td></tr>
          ))}
        </tbody>
      </table>

      <div className={styles.closing}>
        <div>
          <p className={styles.paperH}>Pay to</p>
          <dl className={styles.bankBox}>
            <dt>Account name</dt><dd>{inv.bank.accountName}</dd>
            <dt>Sort code</dt><dd>{formatSortCode(inv.bank.sortCode)}</dd>
            <dt>Account number</dt><dd>{inv.bank.accountNumber}</dd>
          </dl>
        </div>
        <div>
          <p className={styles.paperH}>Summary</p>
          <dl className={styles.summary}>
            <dt>Days worked</dt><dd>{inv.days.length}</dd>
            <dt>Total hours for {formatMonth(inv.month)}</dt><dd>{formatDuration(totalMinutes(inv.days))}</dd>
            <dt>Hourly rate</dt><dd>{formatMoney(inv.rate)}</dd>
          </dl>
          <p className={styles.due}><span>Total due</span><strong>{formatMoney(totalDue(inv))}</strong></p>
        </div>
      </div>
    </article>
  );
}

/** Wave lines from the brand's supporting elements: Aqua over Axolotl Pink. Decorative only. */
function Waves() {
  return (
    <svg className={styles.waves} viewBox="0 0 500 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 5 q31.25 -4 62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0" />
      <path d="M0 11 q31.25 -4 62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0 t62.5 0" />
    </svg>
  );
}
