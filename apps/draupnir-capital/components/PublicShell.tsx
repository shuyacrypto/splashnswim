import type { ReactNode } from "react";

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
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <a href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/horisontal_logo_bordeaux_gold.svg" alt={businessName} className="h-7 w-auto" />
          </a>
          <nav className="flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.14em]">
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
        </div>
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
