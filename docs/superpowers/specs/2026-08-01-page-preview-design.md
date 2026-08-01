# Page preview before publish

Date: 2026-08-01
Status: Approved, pending implementation plan

## Context

Today, saving edits to an already-published page in the admin makes them
live immediately — there is no draft/live distinction anywhere in the data
model (`pages.blocks` is the one and only copy of a page's content, read by
both the admin editor and the public site). An admin fixing a typo on a live
page has no way to check their change before it goes out.

This spec adds a "Preview" action to the page editor that shows exactly what
a page will look like — using the school's real design, not an
approximation — without touching the database and without any schema
change. It is a narrow follow-up to the engine-admin visual redesign
(`docs/superpowers/plans/2026-07-31-engine-admin-redesign.md`), not a
reopening of it.

Two related candidates were discussed alongside this and are explicitly
**out of scope for this spec**, tracked separately for their own future
approval: an enquiry inbox inside the admin, and a "last edited" trail with
undo. Also discussed and **explicitly deferred**: adding "business hours" as
a Site Settings field, and auto-generated LocalBusiness structured data
(schema.org markup built from Settings data with no admin-facing UI). The
structured-data idea sits close to CLAUDE.md's "no SEO tooling beyond basic
metadata fields" boundary and needs the project owner's explicit call before
any code is written, not an assumption baked in here.

## Goals

- An admin can see precisely what a page will look like — real fonts,
  colours, layout, the works — before deciding to publish or re-save a
  change to a live page.
- No database schema change, no new table, no new RLS policy.
- Preview accuracy is guaranteed by construction: it reuses the exact same
  rendering components the public site already uses, rather than a second,
  parallel rendering path that could drift out of sync.
- `packages/engine-admin` stays generic: it knows how to trigger a preview
  and hand off draft content, but has no idea what any school's preview
  page actually renders.

## Non-goals

- No shareable preview links (the mechanism only works in the same browser
  tab group that clicked "Preview" — see Design). If that's wanted later,
  it needs a server-side draft column and is a separate spec.
- No "disabled" or "read-only" mode for the contact/enquiry block during
  preview — it stays fully functional. Submitting a preview page's contact
  form sends a real enquiry. This is acceptable because preview is
  admin-only (see Security below) and mirrors real behaviour an admin might
  actually want to check; adding a preview-mode flag to every block
  component is not worth the complexity for this.
- No per-block preview (e.g. "just show me the hero"). Preview always shows
  the whole page as currently drafted.
- Not built into `apps/practice` in this pass. The new `previewHref` prop
  on `PageEditorScreenProps` is optional specifically so `apps/practice`
  needs zero changes and nothing breaks by omission — learned directly from
  the `apps/practice` gap the last plan's final review caught, where a
  *required* prop change on a shared component broke a second consumer
  nobody had scoped in advance.

## Design

### Flow

1. On the page editor screen, a new "Preview" button appears next to the
   existing Publish/Unpublish button (secondary style, matching the
   existing button variants).
2. Clicking it writes the editor's current in-memory blocks (whatever's
   there right now — saved or not) to `sessionStorage`, under the key
   `engine-admin-preview:<slug>`, as a JSON string of the blocks array.
3. It then opens `/preview/<slug>` in a new browser tab.
4. That route is a small page in the school's own app (not in
   `engine-admin`) that reads the same `sessionStorage` key on load and
   renders the blocks through `PublicShell`/`PublicBlocks` — the identical
   components `apps/splashnswim/app/[slug]/page.tsx` already uses for the
   real public page. No new rendering logic is written; the existing public
   rendering is reused as-is.
5. Because it's `sessionStorage` on the same origin, this only works in the
   same browser (tab or new tab from the same session) that clicked
   Preview — sessionStorage never leaves the browser, is never sent to any
   server, and clears when the browser tab group closes.

### `packages/engine-admin` changes

`PageEditorScreenProps` gains one new **optional** field:

```ts
previewHref?: (slug: string) => string;
```

This follows the exact naming and shape convention already used by
`backHref`/`editHref` elsewhere in this package — the app supplies the URL
shape, `engine-admin` never hardcodes a route. When `previewHref` is not
supplied, no Preview button renders at all (this is how `apps/practice`
stays untouched).

`PageEditorScreen` itself performs the `sessionStorage` write and
`window.open` call — this is plain, identical-for-every-school browser
API usage with no design dependency, so centralising it in `engine-admin`
means every school gets identical, tested behaviour rather than
re-implementing the handoff themselves.

### `apps/splashnswim` changes

- `app/admin/pages/[id]/page.tsx`: pass `previewHref={(slug) => \`/preview/${slug}\`}`
  to `<PageEditorScreen>`.
- New `app/preview/[slug]/page.tsx`: a server component (so it can export
  `metadata` — Next.js does not allow a `metadata` export from a file
  marked `"use client"`) that sets `robots: { index: false, follow: false }`
  and renders a client child component.
- New `app/preview/[slug]/PreviewClient.tsx`: a client component that reads
  `sessionStorage.getItem("engine-admin-preview:" + slug)` on mount, parses
  it, and renders `<PublicShell><PublicBlocks blocks={blocks} /></PublicShell>`.
  If the key is missing or the JSON fails to parse (direct navigation,
  cleared storage, a different browser), it shows a plain-language message
  — "No preview available. Go back to the page editor and click Preview
  again." — with a link back to `/admin/pages`. Never a raw error, never a
  blank page.

### Security

`/preview/*` is added to `middleware.ts`'s existing admin-gate check
(currently only `/admin` triggers the not-signed-in redirect to `/login`).
This is defence in depth, not the primary protection — the primary
protection is that `sessionStorage` physically cannot be populated by
anyone except the browser session that clicked Preview, so a stranger
guessing a preview URL sees only the "no preview available" message, never
draft content. Gating the route too means a signed-out visitor can't even
reach that message, and `noindex` keeps it out of search results entirely.

## Testing

- `packages/engine-admin`: a new test on `PageEditorScreen.test.tsx`
  covering the Preview button — clicking it writes the expected
  `sessionStorage` key/value and calls `window.open` with the URL
  `previewHref` returns, using mocked `sessionStorage`/`window.open`. A
  second test confirms no Preview button renders when `previewHref` is
  omitted.
- `apps/splashnswim`: no test runner (matches this repo's existing
  convention for `apps/*` — `engine-cms` and `apps/splashnswim`/`apps/practice`
  have none either, an explicit prior decision, not an oversight here).
  Verified manually in a browser instead: edit a page's content without
  saving, click Preview, confirm the new tab shows the real SplashNSwim
  design with the unsaved content; confirm navigating directly to a
  `/preview/<slug>` URL with no prior Preview click shows the fallback
  message, not an error; confirm a signed-out visitor is redirected to
  `/login` from `/preview/<slug>`.

## Rollout

Ships as part of the next `engine-admin` release, consumed automatically by
`apps/splashnswim`. `apps/practice` is unaffected (optional prop, omitted).
No feature flag needed — the Preview button simply doesn't exist until an
app opts in by supplying `previewHref`.
