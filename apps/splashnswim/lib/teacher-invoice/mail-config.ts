// Server-side email settings. Uses the same Resend account as the site's
// contact form: by default it sends from onboarding@resend.dev to info@splashnswim.net.
// Override with environment variables if that ever changes.
export const DEFAULT_FROM = "SplashNSwim Invoices <onboarding@resend.dev>";
export const DEFAULT_TO = "info@splashnswim.net";

/** The Resend key the contact form already uses. Change the name here if the site uses a different one. */
export const resendApiKey = () => process.env.RESEND_API_KEY;

export const mailFrom = () => process.env.TEACHER_INVOICE_FROM || DEFAULT_FROM;
export const mailTo = () =>
  (process.env.TEACHER_INVOICE_TO || DEFAULT_TO).split(",").map((s) => s.trim()).filter(Boolean);

/**
 * Resend's shared test sender (onboarding@resend.dev) only delivers to the
 * Resend account owner's own address, so a copy to the teacher would make the
 * whole send fail. The copy switches on automatically once the sender is on a
 * verified domain (e.g. invoices@splashnswim.net).
 */
export const canCopyTeacher = (from = mailFrom()) => !/@resend\.dev>?\s*$/i.test(from.trim());
