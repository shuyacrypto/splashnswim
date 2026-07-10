# SplashNSwim complete website — design

Date: 2026-07-10
Skin: `apps/splashnswim` (consumes the shared engine unchanged)

## Goal

Turn the two-page SplashNSwim skin into a complete marketing website that
converts parents, presents the lessons and venues clearly, and routes
enquiries to `info@splashnswim.net`.

## Fixed facts (owner-confirmed)

- Venues: **Ashingdon** (formerly Rochford), **Benfleet**, **Eastwood**.
  Rename Rochford to Ashingdon everywhere.
- Pricing is **venue-based, per month**: Ashingdon £100, Benfleet £110,
  Eastwood £120. Each fee covers four lessons; pro-rata for closures or
  five-week months.
- Lesson **types** (content, not separate prices): Children, Adult (16+), SEN.
- **Taster**: paid, **£20**, requested via the enquiry form (no on-site payment).
- **Sibling discount**: first child full price, **10% off each additional
  sibling's** monthly fee.
- Enquiries go to **info@splashnswim.net**; that address is also displayed in
  the contact section.
- Credentials to state truthfully: **STA, DBS-checked, Safeguarding trained,
  Paediatric first aid**.
- Testimonials: **placeholders** for now (owner supplies real quotes later).

## Constraints (from CLAUDE.md)

- Only the ten fixed CMS block types. **No new block types, no new engine
  features.** Apps depend on packages; packages never depend on apps.
- Content lives in Supabase; source of truth is
  `apps/splashnswim/db/seed.sql`. The DB is shared, so re-apply carefully.
- The admin panel stays generic. British English, no em dashes.
- Enquiry enrichment happens **at the skin level** (compose a formatted
  message); the engine `EnquiryDetails` shape (`name`, `email`, `message`)
  is unchanged.

## Sitemap

Home `/`, Lessons `/lessons`, Pricing `/pricing`, Venues `/venues`,
About `/about`, Contact `/contact`.

New CMS pages (rows in `pages`): lessons, pricing, venues, contact.
`about` already exists and is enhanced. All rendered by the existing
`app/[slug]/page.tsx`.

Nav (in `PublicShell`): Home · Lessons · Pricing · Venues · About · Contact,
plus a **"Book a £20 taster"** button linking to `/contact`. "Book a lesson"
(OctoSwim) remains available.

## Page content (block by block)

Blocks are chosen only from: hero, rich_text, image, gallery, timetable,
pricing_table, faq, team, cta_banner, contact.

**Home** — hero (with photo) · rich_text (why one-to-one) · rich_text (who we
teach: Children/Adult/SEN summary) · pricing_table (venues) · rich_text
(credentials: STA/DBS/safeguarding/first aid) · rich_text ×2 (testimonial
pull-quotes, placeholder) · faq · cta_banner (Book a £20 taster) · contact
(enquiry form, info@splashnswim.net).

**Lessons** — rich_text intro · rich_text + image for Children · Adult · SEN ·
faq (what to bring / what to expect) · cta_banner (taster).

**Pricing** — rich_text intro (all three types available at every pool) ·
pricing_table (Ashingdon £100 / Benfleet £110 / Eastwood £120, pro-rata
bullets) · rich_text (taster £20, 10% off each additional sibling, pro-rata
explanation) · faq · cta_banner.

**Venues** — rich_text intro · per venue (Ashingdon, Benfleet, Eastwood): a
rich_text description + a **gallery** the admin can upload photos to ·
cta_banner / contact.

**About** — rich_text intro (existing) · rich_text values (warm pools,
teachers in water, weekly progress) · rich_text credentials · cta_banner.
(A `team` block can be added later when instructor profiles are supplied.)

**Contact** — rich_text intro · contact block (enriched enquiry form) showing
info@splashnswim.net.

## Enquiries and email

Skin-level changes only:

- **EnquiryForm** gains fields: name, email, phone (optional), enquiry type
  (General / £20 Taster / SEN), swimmer's age, preferred venue (Ashingdon /
  Benfleet / Eastwood), message.
- **submitEnquiry** composes those into a single formatted `message` string,
  then calls the engine emailer: notification to `info@splashnswim.net` and an
  acknowledgement to the parent.
- **Emailer selection**: use `createEmailer` (Resend) when `RESEND_API_KEY`
  is set; otherwise fall back to `createLogEmailer` so dev still works.
- New env: `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` (on the verified domain),
  `ENQUIRY_NOTIFY_EMAIL=info@splashnswim.net`.
- Owner action (documented, not code): create a Resend account, verify
  `splashnswim.net` (SPF/DKIM/DMARC DNS records Resend provides), paste the
  API key into `.env.local` / Vercel.

## Rendering changes in the skin

- `PublicShell`: new nav links, taster CTA, footer pools list renamed to
  Ashingdon, footer visit links updated.
- `PublicBlocks`: minor styling so a rich_text used as a testimonial reads as
  a pull-quote; contact block already renders the email (ensure it shows
  info@splashnswim.net from content).
- Subpages open with a light rich_text intro (no repeated giant hero).

## Out of scope

No new block types; no testimonial/review widget; no customer logins; no
on-site payment for the taster; no booking-module changes (OctoSwim link
stays). Real reviews and instructor profiles are pending owner content.

## Verification

Run the dev server; for each page confirm it renders, nav works, pricing and
venues display, hero image loads, and the enquiry form submits (log mode) with
a formatted message and info@ recipient. No console errors. Live email
verified once Resend is configured.
