import type { ReactNode } from "react";

const BOOK_URL = "https://octoswim.co.uk/book/splashnswim";

/** The bespoke SplashNSwim page frame: branded header and footer. */
export function PublicShell({
  schoolName,
  children,
}: {
  schoolName: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-aqua/40 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-accent text-lg text-surface shadow-sm"
            >
              {/* Axolotl mascot stand-in */}
              🦎
            </span>
            <span className="text-xl font-extrabold tracking-tight text-primary">
              {schoolName}
            </span>
          </a>
          <nav className="flex items-center gap-5 text-sm font-semibold text-ink">
            <a href="/" className="hover:text-primary">
              Home
            </a>
            <a href="/about" className="hover:text-primary">
              About
            </a>
            <a
              href={BOOK_URL}
              className="rounded-full bg-accent px-4 py-2 text-surface shadow-sm transition-colors hover:bg-accent/90"
            >
              Book now
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-aqua/40 bg-surface">
        <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-primary">{schoolName}</p>
            <p className="mt-1 text-sm text-muted">
              Premium one-to-one swimming lessons.
            </p>
          </div>
          <div className="text-sm text-muted">
            <p className="font-semibold text-ink">Our pools</p>
            <p className="mt-1">Eastwood</p>
            <p>Benfleet</p>
            <p>Rochford</p>
          </div>
          <div className="text-sm text-muted">
            <p className="font-semibold text-ink">Get started</p>
            <a href={BOOK_URL} className="mt-1 block text-primary hover:underline">
              Book a lesson
            </a>
            <a href="/admin" className="mt-1 block hover:text-primary">
              Admin
            </a>
          </div>
        </div>
        <div className="border-t border-aqua/30 py-4 text-center text-xs text-muted">
          &copy; {schoolName}. Made with care in Essex.
        </div>
      </footer>
    </div>
  );
}
