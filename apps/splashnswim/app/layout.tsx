import type { ReactNode } from "react";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const display = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "SplashNSwim | Private 1-to-1 swimming lessons in Essex",
  description:
    "Premium one-to-one swimming lessons at private pools in Eastwood, Benfleet and Ashingdon. Warm, expert teaching that builds confidence fast.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
