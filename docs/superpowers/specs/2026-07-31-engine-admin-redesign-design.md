# engine-admin visual & UX redesign

Date: 2026-07-31
Status: Approved, pending implementation plan

## Context

The admin panel (`packages/engine-admin`) works but looks and feels like a raw,
unstyled form. It is functionally complete for v1 (edit block content, reorder
blocks, toggle published state, upload images, edit site settings, send a
broadcast, view bookings when the module is enabled), but it does not feel
trustworthy or "finished" to a non-technical school admin, gives little
feedback when actions succeed, and leaks technical details (raw storage
paths) that mean nothing to its users.

This redesign only touches **presentation and interaction** for the existing
seven v1 admin capabilities. It adds no new admin capability. Per
[CLAUDE.md](../../../CLAUDE.md), the admin panel must stay "generic and
identical across schools," so all of this work happens in `engine-admin`
(the shared package), never in a school's app (`apps/*`).

A short list of new-capability candidates was discussed alongside this
(an enquiry inbox, preview-before-publish, a "last saved" trail) but those
are explicitly **out of scope for this spec** — each would need its own
proposal and approval before any code is written, per CLAUDE.md's
no-feature-creep rule. Likewise, the "Enable booking and billing" toggle in
Settings stays exactly as it is today (present, honest that it does nothing
until the module exists) — building `engine-booking` is CLAUDE.md's locked
Step 6 and is a separate, much larger piece of work involving real Stripe
payments; it is not part of this spec.

## Goals

- Every existing v1 admin screen gets a visual and interaction upgrade:
  clearer feedback, better hierarchy, less raw/technical exposure.
- The design stays entirely school-agnostic: colours flow through the
  existing `--admin-*` CSS variable system with neutral fallbacks, so a
  school's brand can be layered on without any layout change.
- Works well for a non-technical user: plain language, status visible at a
  glance, big touch targets, one clear primary action per screen.
- No new runtime dependencies beyond a small icon set (`lucide-react`).

## Non-goals

- No new admin capabilities (enquiry inbox, preview, version history, etc.)
  — tracked separately, not built here.
- No booking/payments work — Step 6, separate spec.
- No analytics, dashboards, or AI features anywhere in the admin — explicitly
  out of v1 scope per CLAUDE.md regardless of how "modern admin panel"
  research trends toward them.
- No dark mode — adds real complexity (every token needs a pair) for a tool
  used by one admin per school; not requested and not necessary for the
  stated goal.

## Design

### Visual foundation

A soft, rounded, neutral base: 16px card radius, soft shadows in place of
hard borders where appropriate, generous padding, plain-language copy
throughout. Colour is reserved for meaning, not decoration — green for
published, slate for draft, red only for destructive actions and errors.
This was chosen (over a "crisp/minimal" or "warm" alternative) because it
reads as the most calm and approachable for non-technical users, and a
neutral cool-grey canvas is the safest base for any school's brand colour to
sit on top of via the existing CSS variables.

New/updated tokens live in `packages/engine-admin/src/components/ui.tsx`
as CSS variables with the same neutral-fallback pattern already in place
(e.g. `var(--admin-primary,#0f172a)`) — no hardcoded school colours anywhere
in the package.

Icons come from `lucide-react`, added as a dependency of `engine-admin`
only (not `engine-contracts`, which stays zero-dependency per CLAUDE.md).

### Shell (`AdminShell`)

Replaces the current top bar with a sidebar: logo/brand slot at top, nav
items with icon + label, active item highlighted with the brand colour.
Collapses to a slide-over panel (hamburger toggle) below a tablet-width
breakpoint. This was chosen over an enhanced top bar because it scales
better as sections are added later and gives a stronger "real application"
feel, per the sidebar-vs-topbar comparison reviewed and approved.

### Home screen (new route, `/admin`)

A landing screen shown when an admin logs in. `apps/splashnswim/app/admin/page.tsx`
currently just `redirect("/admin/pages")`; this replaces that redirect with
an actual Home screen. Shows:
- Status cards: page count (+ published/draft split), image count, most
  recent edit (page name + relative time).
- Quick actions: shortcuts to "New page," "Upload images," "Send broadcast."

This is a navigational and orientation aid, not a metrics dashboard — it
reads directly from existing CMS/media data, no new tracking or aggregation
pipeline.

### Shared components (`packages/engine-admin/src/components/ui.tsx`)

- `Toast` / a small toast-notification system: replaces every current
  silent-or-plain-text save confirmation (Pages, Settings, Media,
  Broadcast) with a consistent, auto-dismissing corner notification.
- `ConfirmDialog`: replaces the two current uses of the browser's native
  `window.confirm()` (block delete in `BlockEditor`, image delete in
  `MediaScreen`) with an in-theme modal.
- `EmptyState`: icon + friendly message + call-to-action, replacing bare
  text like "No images uploaded yet."
- `StatusBadge`: standardises the Published/Draft pill already used ad hoc
  in `PageEditorScreen` so it can be reused (e.g. on the Home screen's
  status cards and a future Pages list).

Existing primitives (`Button`, `TextField`, `TextAreaField`, `SelectField`,
`Toggle`, `Card`, `Row`, `RowList`) are restyled in place to the new visual
foundation; their APIs do not change, so no consuming screen needs a
rewrite beyond adopting the new shared components above.

### Media screen

The file `<input type="file">` becomes a drag-and-drop zone (still with a
click-to-browse fallback) that shows a preview thumbnail before the upload
is confirmed. Each uploaded image's card gains inline alt-text editing
(save-on-blur) instead of requiring a separate step, and the raw storage
path is no longer shown — replaced with the original filename and upload
date.

### Block editor

Reorder stays Move-up/Move-down (deliberately, over drag-and-drop) — more
reliable for non-technical users on trackpads and touchscreens, and the
UX research reviewed didn't surface a strong case against it for a list
this short. Buttons are restyled as icon buttons (chevrons), and each block
card gains a small icon matching its type so the list is scannable at a
glance without reading every label.

### Login page

Note: `/login` lives in each school's own app (`apps/splashnswim/app/login`)
and already uses that school's own bespoke Tailwind tokens (e.g. `ocean`,
`foam`, `coral`) rather than the generic `--admin-*` variables used inside
`engine-admin` — confirmed by reading `apps/splashnswim/tailwind.config.ts`.
That's correct and intentional: the login screen is a school-branded front
door (it already shows the school's logo), not part of the constrained,
identical-everywhere interior admin UI. This spec does not change that
pattern or move login into `engine-admin`.

Adds a "Forgot password?" link below the password field, in
`apps/splashnswim/app/login/page.tsx`. Clicking it shows an email-entry step
that calls Supabase's `resetPasswordForEmail`, which emails the admin a link
to a new `apps/splashnswim/app/reset-password/page.tsx` where they set a new
password via Supabase's `updateUser`. Both the request step and the new page
follow the existing login page's own visual style (its school-specific
tokens), not the engine-admin design system. No new backend/table is
needed — this is Supabase Auth's built-in flow. Since only SplashNSwim
exists today, this ships there; the pattern (not the styled code) is what a
future skin-build guide would document for the next school to replicate.

## Error handling

Consistent with the existing pattern (`errorMessages` helper + `ErrorText`
component): failures surface as plain-language inline messages, never raw
Supabase/Postgres error text. Toasts are used only for success confirmation,
never for errors, so a failure is never missed as a transient toast.

## Testing

- Each new/updated component (`Toast`, `ConfirmDialog`, `EmptyState`,
  `StatusBadge`, restyled primitives) gets a focused unit test in
  `engine-admin` covering its interactive behaviour (e.g. a toast
  auto-dismisses, a confirm dialog's cancel path doesn't call its action).
- Manual verification in a real browser against the SplashNSwim admin
  (`apps/splashnswim/app/admin`) for each screen: Home, Pages (list +
  editor), Images, Broadcast, Settings, and the login/reset-password flow —
  checking layout at desktop and mobile widths, and that brand-colour
  theming via `--admin-*` variables still works.
- No changes to `engine-contracts` schemas or RLS policies, so no database
  migration or policy testing is needed for this spec.

## Rollout

This ships as one change to `engine-admin`, consumed automatically by
SplashNSwim (the only school currently deployed) on the next deploy. No
feature flag is needed — there is no old/new state to migrate between,
just a visual and interaction upgrade of existing screens.
