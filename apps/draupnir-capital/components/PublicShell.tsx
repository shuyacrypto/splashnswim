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
      <footer className="border-t border-ink/10 bg-ink text-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-[1.3fr_1fr_1fr] sm:px-10">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/horisontal_logo_white_bordeaux.svg" alt={businessName} className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface/60">
              Institutional private credit for Web3 and DLT-driven businesses.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface/40">Site</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="/" className="text-surface/70 hover:text-surface">Home</a></li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-surface/70 hover:text-surface">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface/40">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm text-surface/70">
              <li>{businessName} Ltd</li>
              <li>Company No. 16530781</li>
              <li><a href="/admin" className="hover:text-surface">Admin</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface/10">
          <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-surface/40 sm:px-10">
            &copy; {new Date().getFullYear()} {businessName}. Not licensed or authorised to provide financial, investment, or tax advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
