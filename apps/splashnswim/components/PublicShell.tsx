import type { ReactNode } from "react";
import { Wave, Wordmark } from "./Brand";

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";

/** The bespoke SplashNSwim page frame: branded header and a wavy navy footer. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-sky bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/brand/axolotl-hero.png"
              alt=""
              className="h-9 w-9 object-contain"
              aria-hidden
            />
            <Wordmark className="text-2xl" />
          </a>
          <nav className="flex items-center gap-6 text-sm font-bold text-navy">
            <a href="/" className="hover:text-ocean">
              Home
            </a>
            <a href="/about" className="hover:text-ocean">
              About
            </a>
            <a
              href={BOOK_URL}
              className="rounded-full bg-coral px-5 py-2.5 text-surface shadow-sm transition-colors hover:bg-coral-deep"
            >
              Book now
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-4 bg-navy text-surface">
        <Wave fillClass="fill-navy" flip />
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-3">
          <div>
            <Wordmark tone="light" className="text-2xl" />
            <p className="mt-2 text-sm text-sky/80">
              Premium one-to-one swimming lessons.
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
            <a href={BOOK_URL} className="mt-2 block text-coral hover:underline">
              Book a lesson
            </a>
            <a href="/admin" className="mt-1 block text-surface/80 hover:text-surface">
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
