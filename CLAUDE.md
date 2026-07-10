# CLAUDE.md — Swim School Engine

You are working on a reusable engine that powers multiple swim school websites. This file is the source of truth. Read it fully before doing anything. If a request conflicts with the rules here, stop and say so rather than proceeding.

## What this project is

One reusable engine (the "70%") built once and shared across every swim school. Each individual school is a separate app that consumes the engine and wears its own bespoke design (the "skin"). The engine is design-agnostic. Bespoke design is never baked into the engine.

## Golden rules (do not break these)

1. **Do not add any feature that is not listed in "v1 scope" below.** If asked to, stop and flag it as out of scope. No feature creep.
2. **The engine packages are the shared foundation.** Apps depend on packages; packages never depend on apps. Never import from `/apps` inside `/packages`.
3. **Apps never touch the database directly.** All data access goes through engine functions. No raw Supabase queries in app or skin code.
4. **`packages/engine-contracts` is the law.** It holds TypeScript interfaces and Zod schemas only, with zero runtime dependencies. Everything else depends on it.
5. **British English everywhere in user-facing text. No em dashes (—) anywhere in copy.**
6. **Follow the locked build order.** Do not skip ahead. Do not start a step before the previous one compiles and is confirmed done.
7. **When unsure, ask a single clear question. Do not guess and build.** Explain choices in plain English; assume the person reading is non-technical.
8. **Every table gets Row Level Security from day one.** No exceptions.

## v1 scope (the ONLY things this engine does)

1. Marketing pages — public pages rendered from CMS content blocks.
2. Admin panel — a deliberately simple, constrained editor for non-technical school admins.
3. Email — transactional sends plus one simple parent broadcast screen.
4. Booking/billing — an OPTIONAL module, switched on per school, ported from an existing booking system.

## Explicitly OUT of scope (never build in v1)

Customer/parent login accounts; multi-tenancy (one deployment per school, always); a freeform page builder; blog engine; SEO tooling beyond basic metadata fields; analytics dashboards; SMS/push/WhatsApp; any AI features; a mobile app; theme marketplace; reseller/white-label features; migration tooling. If any of these is requested, stop and say it is out of v1 scope.

## Locked stack

- **Framework:** Next.js (App Router, latest LTS), TypeScript in strict mode.
- **Monorepo:** pnpm workspaces + Turborepo.
- **Database/auth/storage:** Supabase (one project per school).
- **Payments:** Stripe, charging directly into each school's own Stripe account. Webhooks are the single source of truth. The engine never holds funds.
- **Email:** Resend + React Email templates.
- **Styling:** Tailwind CSS consuming semantic design tokens. Skins never use raw hex values; they define tokens.
- **Hosting:** Vercel (one project per school).

No substitutions. In particular: do NOT introduce Payload, Sanity, Contentful, or any third-party CMS. The CMS is our own constrained block system.

## Repository structure (target)

```
swim-engine/
├── packages/
│   ├── engine-contracts/   # TypeScript interfaces + Zod schemas ONLY. Zero deps.
│   ├── engine-db/          # Supabase schema, migrations, typed client, RLS
│   ├── engine-cms/         # Block model, content read/write API, validation
│   ├── engine-email/       # Resend wrapper, React Email templates, broadcast
│   ├── engine-admin/       # The constrained admin panel (generic-branded)
│   └── engine-booking/     # Optional booking module (added later)
├── apps/
│   └── (schools added later, each its own skin)
├── docs/
└── package.json / pnpm-workspace.yaml / turbo.json
```

## The ten CMS block types (the complete list — do not add more)

hero, rich_text, image, gallery, timetable, pricing_table, faq, team, cta_banner, contact. Each has a Zod schema in engine-contracts. Content that fails validation cannot be saved.

## Admin panel principles

Admins can: edit block content, reorder blocks, toggle published state, upload images, edit site settings, send a broadcast, view bookings (if module enabled). Admins cannot: create block types, edit layout, change design/fonts/colours, or see any code. The admin UI is generic and identical across schools; never restyle it per client. Every destructive action confirms first.

## Locked build order

1. **Scaffold** the monorepo: workspace config, the six package folders, and `engine-contracts` with every interface and Zod schema stubbed and typed. Nothing else until this compiles cleanly.
2. **engine-db:** schema, migrations, RLS policies, seed script.
3. **engine-cms + engine-admin:** block model, validation, admin panel, image upload.
4. **engine-email:** Resend wrapper, transactional templates, broadcast screen.
5. **First reference skin** (a real school) proving marketing + admin + email end to end.
6. **engine-booking:** port the booking system, generalise inventory shape (lane / class_slot / bed), wire into the reference school.
7. Write the skin-build guide.
8. Second skin as the proof the engine did not need changing.

Currently at: **Step 1 (scaffold).**

## Working style with the non-technical owner

- Explain what you are about to do in one or two plain sentences before doing it.
- Make small, reviewable changes. Do not dump hundreds of files at once without explanation.
- After each step, say what was done and what the next step is.
- Never run destructive commands (delete, force, reset) without explaining and asking first.
- If something fails, explain the error in plain English and the fix, without jargon.
