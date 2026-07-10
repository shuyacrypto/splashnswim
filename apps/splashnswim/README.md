# splashnswim

The first real reference **skin**: a bespoke SplashNSwim design on top of the
shared engine. The engine packages are unchanged; only this app's public look
(colours, layout, components) is bespoke. The admin panel stays generic.

Positioning: premium **one-to-one** swimming lessons at private pools in
Eastwood, Benfleet and Ashingdon.

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

## Pages

The site has six pages, all stored as CMS content in `db/seed.sql`: home,
lessons, pricing, venues, about and contact. Editing copy is best done in the
admin panel; `db/seed.sql` is the source of truth for a fresh setup.

## Enquiries and email (Resend)

Website enquiries are emailed to `info@splashnswim.net`, with an automatic
acknowledgement to the parent. Until Resend is configured, enquiries are
logged to the server terminal instead of sent, so development works with no
account.

### Option A: no DNS needed (works with a Wix-hosted domain)

Resend can send from its shared `onboarding@resend.dev` address to your own
account email with no domain and no DNS. This is the quickest way to get
enquiries flowing to `info@splashnswim.net`.

1. Create a free account at resend.com using **info@splashnswim.net**, and
   verify that email address when Resend asks.
2. Resend > API Keys > Create API Key.
3. Set these in `.env.local` (and in Vercel for production):
   - `RESEND_API_KEY` the key you created
   - `EMAIL_FROM_ADDRESS=onboarding@resend.dev`
   - `ENQUIRY_NOTIFY_EMAIL=info@splashnswim.net`
4. Restart the dev server (or redeploy). Enquiries now arrive at
   info@splashnswim.net.

Trade-offs: the "from" shows as onboarding@resend.dev, such messages can be
more likely to land in spam, and the automatic acknowledgement to the parent
is skipped until you verify a domain (Option B). The enquiry itself always
reaches the school.

### Option B: verify a domain (best long term)

This gives branded sending and turns on the parent acknowledgement.

1. Resend > Domains > Add Domain: `splashnswim.net`. Resend shows DNS records
   (an SPF `TXT`, a DKIM `TXT`, usually an `MX`, and an optional DMARC `TXT`).
2. Add them in Wix: Domains > (domain actions) > Manage DNS records > Add
   Record. This is only possible if the domain is connected to Wix via **name
   servers**, not via "pointing". If it is pointed, add the records wherever
   the DNS is actually managed. Propagation can take up to 48 hours.
3. Click Verify in Resend.
4. Set `EMAIL_FROM_ADDRESS` to an address on the verified domain, for example
   `noreply@splashnswim.net`, and keep `ENQUIRY_NOTIFY_EMAIL=info@splashnswim.net`.

Note: receiving mail at `info@splashnswim.net` is separate from sending. That
inbox is provided by your normal email/mailbox host; Resend only sends.
