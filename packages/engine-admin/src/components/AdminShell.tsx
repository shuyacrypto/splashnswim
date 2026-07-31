"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "../icons.js";
import { ToastProvider } from "./Toast.js";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}

/**
 * The frame around every admin screen: a sidebar with navigation, a themed
 * background, and toast support for every screen inside it. Colours come
 * from CSS variables with neutral fallbacks, so the engine is unbranded by
 * default; a consuming app may theme its own admin by setting the
 * --admin-* variables and passing a `brand` node (e.g. a logo).
 */
export function AdminShell({
  children,
  nav,
  title = "Website admin",
  brand,
  footer,
}: {
  children: ReactNode;
  nav: AdminNavItem[];
  title?: string;
  brand?: ReactNode;
  footer?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className={
              item.active
                ? "flex items-center gap-2.5 rounded-xl bg-[var(--admin-primary,#0f172a)] px-3 py-2.5 text-sm font-semibold text-[var(--admin-on-primary,#ffffff)]"
                : "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--admin-muted,#64748b)] hover:bg-[var(--admin-bg,#f8fafc)] hover:text-[var(--admin-text,#0f172a)]"
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="flex items-center gap-2 px-2 pb-6 pt-2">
        {brand ?? <span className="text-base font-bold text-[var(--admin-text,#0f172a)]">{title}</span>}
      </div>
      {navLinks}
      {footer ? <div className="mt-auto pt-4">{footer}</div> : null}
    </>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--admin-bg,#f8fafc)] text-[var(--admin-text,#0f172a)] lg:flex">
        <div className="flex items-center justify-between border-b border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-4 lg:hidden">
          {brand ?? <span className="text-base font-bold">{title}</span>}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-[var(--admin-text,#0f172a)] hover:bg-[var(--admin-bg,#f8fafc)]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-4 lg:flex">
          {sidebarInner}
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[var(--admin-surface,#ffffff)] p-4 shadow-xl">
              {sidebarInner}
            </aside>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-6">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
