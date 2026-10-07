import {
  getSchool,
  type TeacherInvoice,
  formatDateSent,
  formatDayLong,
  formatDuration,
  formatMoney,
  formatMonth,
  invoiceRef,
  totalDue,
  totalMinutes,
} from "./schema";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function invoiceSubject(inv: TeacherInvoice) {
  return `Invoice – ${inv.name} – ${formatMonth(inv.month)} – ${getSchool(inv.school)?.name ?? ""}`;
}

export function invoiceFilename(inv: TeacherInvoice) {
  const safeName = inv.name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const prefix = getSchool(inv.school)?.refPrefix ?? "INV";
  return `Invoice-${prefix}-${safeName}-${inv.month}.pdf`;
}

/**
 * The email itself is a short covering note. The full invoice, including
 * NI number and bank details, is only in the PDF attachment so it isn't
 * repeated in plain text across inboxes and previews.
 */
export function invoiceEmailHtml(inv: TeacherInvoice, dateSent: string) {
  const rows = inv.days
    .map(
      (d) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #D8E3EF;">${esc(formatDayLong(d.date))}</td>
        <td style="padding:6px 0;border-bottom:1px solid #D8E3EF;text-align:right;">${formatDuration(d.minutes)}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#FAFCFD;">
  <div style="max-width:560px;margin:0 auto;padding:24px;font-family:'Nunito Sans',Arial,sans-serif;color:#123B6D;font-size:15px;line-height:1.5;">
    <p style="margin:0 0 4px;font-size:20px;font-weight:700;">Invoice from ${esc(inv.name)} to ${esc(getSchool(inv.school)?.legalName ?? "")}</p>
    <p style="margin:0 0 20px;color:#5A6C86;">${esc(formatMonth(inv.month))}, ref ${esc(invoiceRef(inv))}, sent ${esc(formatDateSent(dateSent))}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;border-bottom:1px solid #D8E3EF;color:#5A6C86;">Day</td><td style="padding:6px 0;border-bottom:1px solid #D8E3EF;color:#5A6C86;text-align:right;">Hours</td></tr>
      ${rows}
      <tr><td style="padding:10px 0 4px;font-weight:700;">Total hours</td><td style="padding:10px 0 4px;font-weight:700;text-align:right;">${formatDuration(totalMinutes(inv.days))}</td></tr>
      <tr><td style="padding:4px 0;">Hourly rate</td><td style="padding:4px 0;text-align:right;">${formatMoney(inv.rate)}</td></tr>
      <tr><td style="padding:10px 12px;background:#123B6D;color:#FAFCFD;font-weight:700;font-size:16px;border-radius:6px 0 0 6px;">Total due</td><td style="padding:10px 12px;background:#123B6D;color:#FAFCFD;font-weight:700;font-size:16px;text-align:right;border-radius:0 6px 6px 0;">${formatMoney(totalDue(inv))}</td></tr>
    </table>
    <p style="margin:20px 0 0;color:#5A6C86;font-size:13px;">The full invoice, with address, National Insurance number and bank details, is attached as a PDF. Reply to this email to reach ${esc(inv.name)} directly.</p>
  </div></body></html>`;
}

export function invoiceEmailText(inv: TeacherInvoice, dateSent: string) {
  const lines = inv.days.map((d) => `${formatDayLong(d.date)}: ${formatDuration(d.minutes)}`);
  return [
    `Invoice from ${inv.name} to ${getSchool(inv.school)?.legalName ?? ""}`,
    `${formatMonth(inv.month)}, ref ${invoiceRef(inv)}, sent ${formatDateSent(dateSent)}`,
    "",
    ...lines,
    "",
    `Total hours: ${formatDuration(totalMinutes(inv.days))}`,
    `Hourly rate: ${formatMoney(inv.rate)}`,
    `Total due: ${formatMoney(totalDue(inv))}`,
    "",
    "The full invoice, with address, National Insurance number and bank details, is attached as a PDF.",
  ].join("\n");
}
