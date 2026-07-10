"use client";

import { useState, type ReactNode } from "react";
import { Logo, WordmarkLight, Waves } from "./Brand";

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";
const TASTER_URL = "/contact?type=taster";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Lessons", href: "/lessons" },
  { label: "Pricing", href: "/pricing" },
  { label: "Venues", href: "/venues" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Vibrant page frame: a clean header and a deep-water footer with waves. */
export function PublicShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-foam bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" aria-label="SplashNSwim home">
            <Logo className="h-9 sm:h-10" />
          </a>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 text-sm font-bold text-ink lg:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-ocean">
                {link.label}
              </a>
            ))}
            <a
              href={TASTER_URL}
              className="rounded-full bg-coral px-5 py-2.5 font-bold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:bg-coral-deep hover:text-surface"
            >
              Book a taster
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-foam lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen ? (
          <nav className="border-t border-foam bg-surface lg:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-bold text-ink hover:bg-foam"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={TASTER_URL}
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-coral px-5 py-3 text-center text-sm font-bold text-ink"
              >
                Book a taster
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="relative bg-abyss pt-16 text-surface">
        <div className="absolute inset-x-0 top-0 h-16 -translate-y-full sm:h-24">
          <div className="relative h-full w-full">
            <Waves colorClass="text-abyss" />
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
          <div>
            <WordmarkLight className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface/70">
              Private one-to-one swimming lessons across south Essex. Warm, expert
              teaching that builds confidence fast.
            </p>
            <p className="mt-4 text-sm">
              <a href="mailto:info@splashnswim.net" className="font-bold text-coral hover:text-surface">
                info@splashnswim.net
              </a>
            </p>
          </div>
          <div className="text-sm">
            <p className="font-display font-bold text-aqua">Our pools</p>
            <ul className="mt-3 space-y-2 text-surface/75">
              <li>Eastwood</li>
              <li>Benfleet</li>
              <li>Ashingdon</li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-display font-bold text-aqua">Visit</p>
            <ul className="mt-3 space-y-2 text-surface/75">
              <li><a href="/lessons" className="hover:text-surface">Lessons</a></li>
              <li><a href="/pricing" className="hover:text-surface">Pricing</a></li>
              <li><a href="/venues" className="hover:text-surface">Venues</a></li>
              <li><a href="/about" className="hover:text-surface">About us</a></li>
              <li><a href="/contact" className="hover:text-surface">Contact</a></li>
              <li><a href={BOOK_URL} className="font-bold text-coral hover:text-surface">Book a lesson</a></li>
              <li><a href="/admin" className="text-surface/55 hover:text-surface">Admin</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-surface/50 sm:px-8">
            &copy; SplashNSwim. Private swimming tuition in Essex.
          </div>
        </div>
      </footer>
    </div>
  );
}
