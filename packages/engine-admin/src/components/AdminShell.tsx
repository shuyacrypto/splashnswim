"use client";

import type { ReactNode } from "react";

export interface AdminNavItem {
  label: string;
  href: string;
  active?: boolean;
}

/**
 * The frame around every admin screen: a header with navigation, and a themed
 * background. Colours come from CSS variables with neutral fallbacks, so the
 * engine is unbranded by default; a consuming app may theme its own admin by
 * setting the --admin-* variables and passing a `brand` node (e.g. a logo).
 */
export function AdminShell({
  children,
  nav,
  title = "Website admin",
  brand,
}: {
  children: ReactNode;
  nav: AdminNavItem[];
  title?: string;
  brand?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--admin-bg,#f8fafc)] text-[var(--admin-text,#0f172a)]">
      <header className="border-b border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {brand ?? <span className="text-base font-bold">{title}</span>}
            <span className="hidden rounded-full bg-[var(--admin-bg,#f8fafc)] px-2.5 py-0.5 text-xs font-semibold text-[var(--admin-muted,#64748b)] sm:inline">
              Admin
            </span>
          </div>
          <nav className="flex flex-wrap gap-1.5 text-sm">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  item.active
                    ? "rounded-full bg-[var(--admin-primary,#0f172a)] px-3.5 py-1.5 font-semibold text-[var(--admin-on-primary,#ffffff)]"
                    : "rounded-full px-3.5 py-1.5 font-medium text-[var(--admin-muted,#64748b)] hover:bg-[var(--admin-bg,#f8fafc)] hover:text-[var(--admin-text,#0f172a)]"
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">{children}</main>
    </div>
  );
}
