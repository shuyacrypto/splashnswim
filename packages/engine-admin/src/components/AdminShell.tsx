"use client";

import type { ReactNode } from "react";

export interface AdminNavItem {
  label: string;
  href: string;
  active?: boolean;
}

/**
 * The frame around every admin screen: a fixed, generic header with the same
 * navigation for every school. Deliberately unbranded.
 */
export function AdminShell({
  children,
  nav,
  title = "Website admin",
}: {
  children: ReactNode;
  nav: AdminNavItem[];
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-base font-semibold">{title}</span>
          <nav className="flex gap-4 text-sm">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  item.active
                    ? "font-semibold text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">{children}</main>
    </div>
  );
}
