import type { ReactNode } from "react";
import { Marcellus, Manrope } from "next/font/google";
import "./globals.css";

// Marcellus: a calm, classical roman that reads premium without shouting.
const display = Marcellus({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "SplashNSwim | Private 1-to-1 swimming lessons in Essex",
  description:
    "Premium one-to-one swimming lessons at private pools in Eastwood, Benfleet and Rochford. Calm, expert teaching for every swimmer.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
