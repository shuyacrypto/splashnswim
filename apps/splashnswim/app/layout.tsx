import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "SplashNSwim | Premium 1-to-1 swimming lessons",
  description:
    "Premium one-to-one swimming lessons at private pools in Eastwood, Benfleet and Rochford. Helping every swimmer progress faster.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
