import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Practice School",
  description: "A plumbing-proof practice school built on the swim engine.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}
