import type { ReactNode } from "react";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Draupnir Capital | Gateway to Private Credit",
  description:
    "Institutional private credit for Web3 and DLT-driven businesses. Draupnir Capital structures non-bank credit facilities and places them directly with institutional lenders.",
  openGraph: {
    title: "Draupnir Capital | Gateway to Private Credit",
    description: "Institutional private credit for Web3 and DLT-driven businesses.",
    siteName: "Draupnir Capital",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body className="bg-surface text-ink">{children}</body>
    </html>
  );
}
