# Draupnir Capital: engine generalization + first non-swim skin

Date: 2026-08-05
Status: Approved, pending implementation plan

## Context

CLAUDE.md scopes this repository as a "swim school engine": the mission
statement, golden rules, and admin-panel language all assume every client is
a swim school. The owner wants to build a marketing site for Draupnir
Capital, a London-based placement agent connecting institutional private
credit lenders with Web3/DLT-driven businesses — not a swim school. Rather
than bolt this on as a one-off exception, the owner's explicit decision
(asked and confirmed directly) is to generalize the engine on purpose: keep
one shared engine that works for any small business, with vertical-specific
modules (like the booking/billing module swim schools use) built on top only
when a client actually needs them. This spec is that generalization, plus
the first skin that proves it: `apps/draupnir-capital`.

Draupnir needs marketing pages and the constrained admin panel only.
Explicitly no booking/billing (informational site, email enquiries only; a
Calendly embed may come later but is not decided and not part of this spec).
This means the swim-specific parts of the engine already in place —
`timetable`, `pricing_table` blocks, `engine-booking` — need no code changes
at all; they simply become "used by clients who need them" rather than
assumed-universal.

Research inputs (provided by the owner): `Draupnir Capital.zip` (brand
guidelines, pitch deck, Web3 one-pager, deal timeline, letterhead — all
PDFs) and `draupnir_logo_bordeaux.zip` (full logo asset kit, SVG + PNG). The
current live site at draupnir.capital was also reviewed: it is a generic,
unbranded template with thin copy, not a baseline worth preserving.

## Goals

- CLAUDE.md accurately describes a multi-vertical engine, not a swim-only
  one, without loosening any of its actual golden rules (no feature creep,
  contracts-first, RLS everywhere, apps never touch the DB directly, etc.).
- The ten-block CMS model gains exactly two new generic block types —
  `stats` and `feature_grid` — added as "a deliberate engine change,"
  per CLAUDE.md's own existing language anticipating this. Both are
  vertical-neutral (useful to any future client, not finance-specific).
- A new skin, `apps/draupnir-capital`, renders Draupnir's real brand
  (bordeaux/near-black palette, Space Grotesk + IBM Plex Sans, supplied logo
  lockups) and real content (positioning, services, track record, team,
  contact), editable through the same generic admin panel every other skin
  uses.
- Content copy follows the stop-slop rules (direct, active voice, no filler,
  no em dashes — the last one already required by CLAUDE.md) and the brand
  voice guide's "precise, not stiff; earned, not hyped" principle.
- Every table gets RLS from day one, per CLAUDE.md, no exceptions for this
  being a "simple" informational site.

## Non-goals

- No booking/billing module for Draupnir. `engine-booking` is not touched
  and not wired into this skin.
- No renaming of swim-specific internals (`timetable` block, `engine-booking`
  inventory model, etc.) — out of scope per the owner's own "one engine,
  optional modules on top" framing. Only the mission-level language changes.
- No sweeping rename of every internal variable/comment across every package
  that happens to say "school" (e.g. component internals in
  `engine-admin`). Only the load-bearing, customer-facing or schema-level
  wording changes: CLAUDE.md itself, and `siteSettingsSchema.schoolName` →
  `businessName` (this field is admin-facing and would visibly read wrong
  for Draupnir). Anything else found to read badly for a non-swim client
  during implementation gets fixed as a small, targeted change, not a
  repo-wide sweep.
- Not going live on the `draupnir.capital` domain. This spec covers the
  build only; DNS cutover is a separate, explicit step once the build is
  reviewed.
- No real team headshots yet — the owner will provide these later. A
  placeholder (extracted from the pitch-deck PDF, or an initials avatar,
  decided during implementation) stands in until then.
- No new business type validation, tenancy model, or config system for
  "which vertical is this." Each skin is still its own independent app and
  Supabase project, exactly as today; "generalizing" here means the engine
  no longer assumes swim-school content, not that it gains a vertical-switch
  mechanism.

## Design

### CLAUDE.md changes

- Title and opening paragraph: describe the engine as powering marketing
  sites for small/professional-services businesses generally, swim schools
  being one example rather than the whole premise.
- Golden rules: unchanged in substance; rule 1 ("no feature not in v1
  scope") stays, since it is what makes this generalization disciplined
  rather than a free-for-all.
- "The ten CMS block types" section becomes twelve, listing `stats` and
  `feature_grid` alongside the existing ten, with the same "closed list,
  deliberate change only" framing.
- Admin panel principles: replace "identical across schools" /
  "school admins" wording with "identical across clients" / "client admins".
- Repository structure comment (`apps/ # schools added later, each its own
  skin`) becomes `apps/ # clients added later, each its own skin`.
- Locked build order step 5 ("First reference skin (a real school)"):
  leave as historical record of what step 5 already was (`practice`,
  `octoworks`); Draupnir is additional proof the generalization holds, not a
  redo of step 5.

### New block types (`packages/engine-contracts/src/blocks`)

**`stats`** — a row of callout numbers (e.g. "$3.5Bn+ mandated").

```ts
export const statItemSchema = z.object({
  value: z.string().min(1),      // e.g. "$3.5Bn+", admin-typed, not computed
  label: z.string().min(1),      // e.g. "Term sheets mandated on"
  description: z.string().optional(),
});

export const statsBlockSchema = blockBaseSchema.extend({
  type: z.literal("stats"),
  heading: z.string().optional(),
  items: z.array(statItemSchema).min(1),
});
```

**`feature_grid`** — a grid of cards, optionally numbered for sequential
steps (covers "what we do", "how it works", "facility types", "regions").

```ts
export const featureItemSchema = z.object({
  // Key into a small, fixed icon set (e.g. a lucide-react name) that
  // engine-admin offers as a dropdown, never free-text design input.
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
});

export const featureGridBlockSchema = blockBaseSchema.extend({
  type: z.literal("feature_grid"),
  heading: z.string().optional(),
  numbered: z.boolean().default(false),
  items: z.array(featureItemSchema).min(1),
});
```

Both get added to `BLOCK_TYPES` and the `blockSchema` discriminated union in
`blocks/index.ts`, following the exact pattern the existing ten blocks use.
`engine-admin`'s block editor needs a form for each new type, matching the
style of the existing block editors (e.g. `team`'s member-list editor is the
closest existing pattern for `feature_grid`'s item list).

### `siteSettingsSchema` change

`schoolName` → `businessName` in
`packages/engine-contracts/src/content/site-settings.ts`, with the doc
comment updated from "a school admin can edit" to "a client admin can
edit". This is a breaking rename of a contract field; `engine-cms`,
`engine-admin`, and every app's seed data that reference `schoolName` need
updating in the same change to keep the build green (per CLAUDE.md's locked
build order discipline — nothing half-migrated).

### `apps/draupnir-capital`: pages and content

New Next.js app, structured exactly like `apps/octoworks` (own
`package.json` depending on the workspace packages, own `.env.local`, own
`db/setup.sql` + `db/seed.sql`, own Supabase project). Five pages:

1. **Home** — `hero` (heading "Gateway to Private Credit", subheading from
   the positioning statement) → `rich_text` (full positioning statement) →
   `stats` (the three headline numbers: $3.5Bn+ mandated, $500M+ obtained,
   12 mandates) → `feature_grid` (Capital Introduction / Deal Structuring,
   2 cards, not numbered) → `cta_banner` ("Let's talk", linking to Contact).
2. **What We Do** — `feature_grid` numbered (Structure → Access →
   Execution) → `feature_grid` (the seven facility types: Invoice,
   Supply-Chain, Trade, Receivables, AR/AP, Payments, Equipment Financing).
3. **Our Work** — `stats` (repeated headline numbers) → `rich_text` (the
   BlackOpal · GemStone case study as prose, with the Boris Redfern quote
   set as a blockquote) → `feature_grid` (six regions: UK (HQ), Europe ex-
   Russia, North America, Latin America, MENA, APAC — no icons, just name +
   short description).
4. **Team** — `team` block: Boris Redfern (Head of Capital Markets) and
   Sebastian Cheek (Head of Operations & Investment), bios from the pitch
   deck, photo placeholders pending real headshots.
5. **Contact** — `contact` block (enquiry form on, `showEnquiryForm: true`,
   routed through `engine-email`/Resend to Boris and Sebastian) → `rich_text`
   for the regulatory disclaimer ("Draupnir Capital Ltd (Company No.
   16530781) is not licensed or authorised to provide financial,
   investment, or tax advice...") and the registered office address (84
   Eccleston Square, Pimlico, London, SW1V 1PX).

All copy written following the stop-slop rules and the brand voice guide:
precise claims traceable to a number or a mandate, no "revolutionary" /
"game-changing" language, "warehouse facility" and "on-chain" used plainly
without over-explaining, no em dashes.

### Visual design

Tailwind config in `apps/draupnir-capital` defines semantic tokens (never
raw hex in components) mapped to the supplied palette:

| Token | Hex |
|---|---|
| `--color-brand-dark` | `#4F0C20` (Bordeaux Dark) |
| `--color-brand-mid` | `#8C193C` (Bordeaux Mid) |
| `--color-brand-light` | `#AE3D5F` (Bordeaux Light) |
| `--color-ink` | `#19191C` (Near Black) |
| `--color-surface` | `#FFFFFF` |

Fonts: Space Grotesk (display/headings) and IBM Plex Sans (body), both
Google Fonts, loaded via `next/font`. Logo files copied as-is from the
supplied kit into `apps/draupnir-capital/public/` — every needed lockup
(horizontal/vertical, light/dark, flat fallback, mark-only for favicon)
already exists in the zip, no new asset generation required. Per the brand
guide's imagery direction, section backgrounds use the supplied gradient
artwork as texture; no stock photography is used anywhere.

### Infrastructure

New standalone Supabase project (Draupnir gets its own, per the existing
"one project per client" rule — never shared with another client's data).
RLS policies on every table from creation, following the same pattern as
`practice`/`octoworks`'s `db/setup.sql`. New Vercel project. Enquiry emails
sent via the existing `engine-email`/Resend wrapper, in "log to screen" mode
until Resend is actually wired up for this client (same as `practice` and
`octoworks` start out).

## Open items for the implementation plan

- Exact wording/line edits for CLAUDE.md's mission and admin-panel sections.
- `engine-admin` editor UI for `stats` and `feature_grid` blocks.
- Whether team headshot placeholders are extracted PDF images or initials
  avatars (small decision, can be made during implementation).
- Full text of all Draupnir page copy (drafted during implementation,
  reviewed against stop-slop + brand voice before going in).
