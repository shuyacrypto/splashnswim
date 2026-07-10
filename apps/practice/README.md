# practice

A plumbing-proof practice school. It is deliberately plain: the point is to
prove the engine works end to end (public pages, admin panel, email), not to
look good.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in your Supabase values.
2. In the Supabase SQL editor, run `db/setup.sql` (creates the tables), then
   `db/seed.sql` (adds the Riverside sample content).
3. Create an admin user in Supabase (Authentication > Users > Add user), with a
   confirmed email and password.
4. From the repo root: `pnpm --filter practice dev`, then open
   http://localhost:3000

## What to look at

- `/` - the public home page, rendered from the database.
- `/admin` - the admin panel (sign in first at `/login`).

Email is in "log to screen" mode: enquiries and broadcasts are printed to the
terminal running the dev server, not sent.
