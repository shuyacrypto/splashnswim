import type { Metadata } from "next";
import localFont from "next/font/local";
import TeacherInvoiceForm from "./TeacherInvoiceForm";
import { canCopyTeacher } from "../../lib/teacher-invoice/mail-config";
import styles from "./teacher-invoice.module.css";

// Brand fonts (Brand Guidelines v1.1, section 05): Fredoka for headings and buttons,
// Nunito Sans for body. Self-hosted from lib/teacher-invoice/fonts so the page and PDF match.
const fredoka = localFont({
  src: [
    { path: "../../lib/teacher-invoice/fonts/Fredoka-Medium.ttf", weight: "500" },
    { path: "../../lib/teacher-invoice/fonts/Fredoka-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-fredoka",
  display: "swap",
});
const nunitoSans = localFont({
  src: [
    { path: "../../lib/teacher-invoice/fonts/NunitoSans-Regular.ttf", weight: "400" },
    { path: "../../lib/teacher-invoice/fonts/NunitoSans-SemiBold.ttf", weight: "600" },
    { path: "../../lib/teacher-invoice/fonts/NunitoSans-Bold.ttf", weight: "700" },
  ],
  variable: "--font-nunito-sans",
  display: "swap",
});

// Hidden page: not linked anywhere, kept out of search engines.
export const metadata: Metadata = {
  title: "Teacher invoices | SplashNSwim",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function TeacherInvoicePage() {
  return (
    <main className={`${styles.page} ${fredoka.variable} ${nunitoSans.variable}`}>
      <TeacherInvoiceForm copyToTeacher={canCopyTeacher()} />
    </main>
  );
}
