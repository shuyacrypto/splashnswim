import type { ReactNode } from "react";

const NAV_LINKS = [
  { href: "/what-we-do", label: "What We Do" },
  { href: "/our-work", label: "Our Work" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

/** The public site frame: branded header with nav, plain footer with an admin link. */
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/horisontal_logo_bordeaux_gold.svg" alt={businessName} className="h-8 w-auto" />
          </a>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-brand-mid">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-ink/10 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 text-xs text-ink/50">
          <span>{businessName}</span>
          <a href="/admin" className="hover:text-ink">Admin</a>
        </div>
      </footer>
    </div>
  );
}
