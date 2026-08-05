"use client";

import { useState, type ReactNode } from "react";

const NAV_LINKS = [
  { href: "/what-we-do", label: "What We Do" },
  { href: "/our-work", label: "Our Work" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

/** The public site frame: restrained header with tracked nav, plain footer with an admin link. */
export function PublicShell({
  businessName,
  children,
}: {
  businessName: string;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <a href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/horisontal_logo_bordeaux_gold.svg" alt={businessName} className="h-9 w-auto sm:h-10" />
          </a>

          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.14em] md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-ink/60 underline decoration-transparent decoration-2 underline-offset-4 transition hover:text-ink hover:decoration-brand-mid"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center text-ink md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {menuOpen ? (
          <nav className="border-t border-ink/10 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4 sm:px-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/70 hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-ink/50 sm:px-10">
          <span>{businessName}</span>
          <a href="/admin" className="hover:text-ink">Admin</a>
        </div>
      </footer>
    </div>
  );
}
