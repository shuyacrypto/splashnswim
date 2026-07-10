# splashnswim

The first real reference **skin**: a bespoke SplashNSwim design on top of the
shared engine. The engine packages are unchanged; only this app's public look
(colours, layout, components) is bespoke. The admin panel stays generic.

Positioning: premium **one-to-one** swimming lessons at private pools in
Eastwood, Benfleet and Rochford. Mascot: an axolotl.

## Design tokens

Brand colours live in one place: `app/globals.css` (`:root`), mapped to
semantic Tailwind names in `tailwind.config.ts` (primary, accent, ink, and so
on). Components never use raw hex. To rebrand, change only those token values.

## Setup (reuses the practice Supabase project)

For 5b we reuse the practice database and admin login, so there is no schema
step. Just load the SplashNSwim content:

1. `.env.local` already holds the same Supabase values as the practice app.
2. In the Supabase SQL editor, run `db/seed.sql`. It replaces the site
   settings and the home/about pages with SplashNSwim content (overwriting the
   Riverside sample in that throwaway project).
3. From the repo root: `pnpm --filter splashnswim dev`, then open the shown URL.
4. Sign in to `/admin` with the same user you created for the practice run.

Email is still in "log to screen" mode: enquiries and broadcasts print to the
terminal.
