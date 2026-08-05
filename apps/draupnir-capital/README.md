# draupnir-capital

Draupnir Capital: institutional private credit placement agent, built on
the shared engine.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in Draupnir's own
   Supabase project values (a separate project from every other client).
2. In that Supabase project's SQL editor, run `db/setup.sql` (creates the
   tables), then `db/seed.sql` (adds the real Draupnir Capital content).
3. Create an admin user in Supabase (Authentication > Users > Add user), with
   a confirmed email and password.
4. From the repo root: `pnpm --filter draupnir-capital dev`, then open
   http://localhost:3000

## What to look at

- `/` - the public home page, rendered from the database.
- `/admin` - the admin panel (sign in first at `/login`).

Email is in "log to screen" mode: enquiries are printed to the terminal
running the dev server, not sent, until Resend is wired up.
