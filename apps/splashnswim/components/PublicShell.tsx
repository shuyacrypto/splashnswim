import type { ReactNode } from "react";
import { Logo, WordmarkLight } from "./Brand";

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";

/** Premium page frame: a quiet header and an elegant deep-navy footer. */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/" aria-label="SplashNSwim home">
            <Logo className="h-8 sm:h-9" />
          </a>
          <nav className="flex items-center gap-6 text-sm sm:gap-8">
            <a href="/" className="hidden text-slate transition-colors hover:text-ink sm:inline">
              Home
            </a>
            <a href="/about" className="hidden text-slate transition-colors hover:text-ink sm:inline">
              About
            </a>
            <a
              href={BOOK_URL}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-deep hover:text-surface"
            >
              Book a lesson
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-ink-deep text-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
          <div>
            <WordmarkLight className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface/60">
              Private one-to-one swimming lessons across south Essex. Calm pools,
              expert teaching, real progress.
            </p>
          </div>
          <div className="text-sm">
            <p className="text-xs uppercase tracking-eyebrow text-surface/45">Pools</p>
            <ul className="mt-4 space-y-2 text-surface/75">
              <li>Eastwood</li>
              <li>Benfleet</li>
              <li>Rochford</li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="text-xs uppercase tracking-eyebrow text-surface/45">Visit</p>
            <ul className="mt-4 space-y-2 text-surface/75">
              <li>
                <a href={BOOK_URL} className="text-accent transition-colors hover:text-surface">
                  Book a lesson
                </a>
              </li>
              <li>
                <a href="/about" className="transition-colors hover:text-surface">
                  About us
                </a>
              </li>
              <li>
                <a href="/admin" className="text-surface/50 transition-colors hover:text-surface">
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-surface/45 sm:px-8">
            &copy; SplashNSwim. Private swimming tuition in Essex.
          </div>
        </div>
      </footer>
    </div>
  );
}
