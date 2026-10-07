// Shared between the form (browser) and the API route (server).
// Keep this file free of Node-only imports.

export type WorkedDay = {
  date: string; // YYYY-MM-DD
  minutes: number; // time worked that day, in whole minutes (lessons are 20 min)
};

export type SchoolId = "splashnswim" | "seadragons";

export type TeacherInvoice = {
  school: SchoolId | ""; // who the invoice is addressed to
  name: string;
  email: string;
  address: string; // multi-line
  niNumber: string;
  month: string; // YYYY-MM, the month being invoiced
  rate: number; // hourly rate in pounds, e.g. 25 or 22.5
  days: WorkedDay[];
  bank: {
    accountName: string;
    sortCode: string; // 6 digits, stored without dashes
    accountNumber: string; // 8 digits
  };
};

export type School = {
  id: SchoolId;
  name: string; // how the school is shown on screen
  legalName: string;
  tradingAs?: string;
  addressLines: string[];
  companyNo?: string;
  refPrefix: string; // start of the invoice reference
};

// The two schools a teacher can invoice. Add a school here and it appears on the page.
export const SCHOOLS: Record<SchoolId, School> = {
  splashnswim: {
    id: "splashnswim",
    name: "SplashNSwim",
    legalName: "Splash N Swim Ltd",
    tradingAs: "SplashNSwim",
    addressLines: ["62 (The Annexe) Woodcutters Avenue", "Leigh-on-Sea", "Essex SS9 4PL"],
    companyNo: "16011030",
    refPrefix: "SNS",
  },
  seadragons: {
    id: "seadragons",
    name: "Sea Dragons Swim School",
    legalName: "Sea Dragons Swim School Ltd",
    addressLines: ["42 Woodcutters Avenue", "Leigh-on-Sea", "Essex SS9 4PL"],
    refPrefix: "SDS",
  },
};
export const SCHOOL_IDS = Object.keys(SCHOOLS) as SchoolId[];
export const isSchoolId = (v: unknown): v is SchoolId => typeof v === "string" && v in SCHOOLS;
export const getSchool = (id: SchoolId | "") => (isSchoolId(id) ? SCHOOLS[id] : null);

// ---------- formatting ----------

export const cleanNi = (v: string) => v.replace(/\s+/g, "").toUpperCase();
export const cleanDigits = (v: string) => v.replace(/\D/g, "");

export const formatNi = (v: string) => {
  const c = cleanNi(v);
  return c.length === 9
    ? `${c.slice(0, 2)} ${c.slice(2, 4)} ${c.slice(4, 6)} ${c.slice(6, 8)} ${c.slice(8)}`
    : c;
};

export const formatSortCode = (v: string) => {
  const d = cleanDigits(v);
  return d.length === 6 ? `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}` : d;
};

/** 160 -> "2h 40m", 180 -> "3h", 20 -> "20m" */
export const formatDuration = (minutes: number) => {
  const m = Math.max(0, Math.round(Number(minutes) || 0));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r}m`;
  return r ? `${h}h ${r}m` : `${h}h`;
};

export const totalMinutes = (days: WorkedDay[]) =>
  days.reduce((s, d) => s + (Math.round(Number(d.minutes)) || 0), 0);

/**
 * Pay = time worked x hourly rate, rounded to the penny.
 * Worked in whole minutes and whole pence so 20-minute lessons never
 * pick up decimal-hour rounding (2h 40m is exactly 160 minutes, not 2.67 hours).
 */
export const totalDue = (inv: Pick<TeacherInvoice, "days" | "rate">) => {
  const ratePence = Math.round((Number(inv.rate) || 0) * 100);
  return Math.round((totalMinutes(inv.days) * ratePence) / 60) / 100;
};

const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export const formatMoney = (n: number) => GBP.format(Number(n) || 0);

const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const formatDayLong = (iso: string) =>
  parseISODate(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const formatMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const todayISO = () => {
  // Date in UK time, so a late-evening send isn't stamped tomorrow/yesterday.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts; // en-CA gives YYYY-MM-DD
};

export const formatDateSent = (iso: string) =>
  parseISODate(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/** e.g. SNS-JS-2026-09 for Jane Smith invoicing SplashNSwim for September 2026 */
export const invoiceRef = (inv: Pick<TeacherInvoice, "school" | "name" | "month">) => {
  const { name, month } = inv;
  const prefix = getSchool(inv.school)?.refPrefix ?? "INV";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 3);
  return `${prefix}-${initials || "T"}-${month}`;
};

// ---------- validation ----------

const NI_RE = /^(?!BG|GB|KN|NK|NT|TN|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\d{6}[A-D]$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Errors = Partial<Record<string, string>>;

export function validate(inv: TeacherInvoice): Errors {
  const e: Errors = {};
  if (!isSchoolId(inv.school)) e.school = "Choose which school you're invoicing.";
  if (!inv.name.trim()) e.name = "Enter your full name.";
  if (!EMAIL_RE.test(inv.email.trim()))
    e.email = "Enter an email address so we can send you a copy.";
  if (inv.address.trim().length < 8) e.address = "Enter your full address, including postcode.";
  if (!NI_RE.test(cleanNi(inv.niNumber)))
    e.niNumber = "Enter a National Insurance number like AB 12 34 56 C.";
  if (!/^\d{4}-\d{2}$/.test(inv.month)) e.month = "Choose the month you're invoicing for.";
  const r = Number(inv.rate);
  if (!(r >= 1 && r <= 200)) e.rate = "Enter your hourly rate in pounds, like 25 or 22.50.";
  else if (Math.abs(Math.round(r * 100) - r * 100) > 1e-6) e.rate = "Hourly rate can only go to two decimal places.";

  if (inv.days.length === 0) {
    e.days = "Add at least one day you worked.";
  } else {
    const seen = new Set<string>();
    for (const d of inv.days) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !d.date.startsWith(inv.month)) {
        e.days = "Every day worked needs to fall in the month you're invoicing for.";
        break;
      }
      if (seen.has(d.date)) {
        e.days = `${formatDayLong(d.date)} is listed twice.`;
        break;
      }
      seen.add(d.date);
      const m = Number(d.minutes);
      if (!Number.isInteger(m) || m < 5 || m > 16 * 60) {
        e.days = `Enter how long you worked on ${formatDayLong(d.date)}.`;
        break;
      }
    }
  }

  if (!inv.bank.accountName.trim()) e.accountName = "Enter the name on the bank account.";
  if (cleanDigits(inv.bank.sortCode).length !== 6)
    e.sortCode = "A sort code is 6 digits, like 12-34-56.";
  if (cleanDigits(inv.bank.accountNumber).length !== 8)
    e.accountNumber = "An account number is 8 digits.";
  return e;
}

/** Normalise what came over the wire before validating on the server. */
export function normalise(raw: unknown): TeacherInvoice | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, any>;
  const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");
  const days = Array.isArray(r.days) ? r.days.slice(0, 31) : [];
  return {
    school: isSchoolId(r.school) ? r.school : "",
    name: str(r.name, 120).trim(),
    email: str(r.email, 200).trim(),
    address: str(r.address, 400).trim(),
    niNumber: cleanNi(str(r.niNumber, 20)),
    month: str(r.month, 7),
    rate: typeof r.rate === "number" || typeof r.rate === "string" ? Number(r.rate) : NaN,
    days: days
      .map((d: any) => ({ date: str(d?.date, 10), minutes: Number(d?.minutes) }))
      .sort((a: WorkedDay, b: WorkedDay) => a.date.localeCompare(b.date)),
    bank: {
      accountName: str(r.bank?.accountName, 120).trim(),
      sortCode: cleanDigits(str(r.bank?.sortCode, 20)),
      accountNumber: cleanDigits(str(r.bank?.accountNumber, 20)),
    },
  };
}
