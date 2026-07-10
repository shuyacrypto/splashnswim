import type { ReactNode } from "react";
import { Logo, WordmarkLight, Waves } from "./Brand";

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";

/** Vibrant page frame: a clean header and a deep-water footer with waves. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-foam bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" aria-label="SplashNSwim home">
            <Logo className="h-9 sm:h-10" />
          </a>
          <nav className="flex items-center gap-6 text-sm font-bold text-ink sm:gap-8">
            <a href="/" className="hidden transition-colors hover:text-ocean sm:inline">Home</a>
            <a href="/about" className="hidden transition-colors hover:text-ocean sm:inline">About</a>
            <a
              href={BOOK_URL}
              className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:bg-coral-deep hover:text-surface"
            >
              Book a lesson
            </a>
          </nav>
        </div>
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
          </div>
          <div className="text-sm">
            <p className="font-display font-bold text-aqua">Our pools</p>
            <ul className="mt-3 space-y-2 text-surface/75">
              <li>Eastwood</li>
              <li>Benfleet</li>
              <li>Rochford</li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-display font-bold text-aqua">Visit</p>
            <ul className="mt-3 space-y-2 text-surface/75">
              <li><a href={BOOK_URL} className="font-bold text-coral hover:text-surface">Book a lesson</a></li>
              <li><a href="/about" className="hover:text-surface">About us</a></li>
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
