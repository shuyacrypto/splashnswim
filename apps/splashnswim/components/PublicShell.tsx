import type { ReactNode } from "react";
import { Logo, Wave, WordmarkLight } from "./Brand";

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";

/** The bespoke SplashNSwim page frame: branded header and a wavy navy footer. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-sky bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <a href="/" aria-label="SplashNSwim home">
            <Logo className="h-9 sm:h-10" />
          </a>
          <nav className="flex items-center gap-5 text-sm font-bold text-navy sm:gap-7">
            <a href="/" className="hidden hover:text-ocean sm:inline">
              Home
            </a>
            <a href="/about" className="hidden hover:text-ocean sm:inline">
              About
            </a>
            <a
              href={BOOK_URL}
              className="rounded-full bg-coral px-5 py-2.5 text-surface shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-coral-deep"
            >
              Book a lesson
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-6 bg-navy text-surface">
        <Wave fillClass="fill-navy" flip />
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-3">
          <div>
            <WordmarkLight className="text-2xl" />
            <p className="mt-2 max-w-xs text-sm text-sky/80">
              Premium one-to-one swimming lessons across south Essex.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-display font-semibold text-sky">Our pools</p>
            <p className="mt-2 text-surface/80">Eastwood</p>
            <p className="text-surface/80">Benfleet</p>
            <p className="text-surface/80">Rochford</p>
          </div>
          <div className="text-sm">
            <p className="font-display font-semibold text-sky">Get started</p>
            <a href={BOOK_URL} className="mt-2 block font-bold text-coral hover:underline">
              Book a lesson
            </a>
            <a href="/about" className="mt-1 block text-surface/80 hover:text-surface">
              About us
            </a>
            <a href="/admin" className="mt-1 block text-surface/60 hover:text-surface">
              Admin
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-surface/60">
          &copy; SplashNSwim. Made with care in Essex.
        </div>
      </footer>
    </div>
  );
}
