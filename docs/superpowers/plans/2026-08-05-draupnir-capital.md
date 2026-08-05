# Draupnir Capital: Engine Generalization + New Skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generalize the engine's mission away from "swim school only," add two new generic CMS block types (`stats`, `feature_grid`), and ship `apps/draupnir-capital`, a fully branded five-page marketing site + admin for Draupnir Capital.

**Architecture:** No architectural change to the engine's shape — contracts-first, apps depend on packages, one Supabase project per client, blocks stored as JSONB validated against `engine-contracts`. This plan touches every layer exactly once each (contracts → db → cms → admin → existing apps → new app) to keep the monorepo compiling at every commit, per the locked build order.

**Tech Stack:** Next.js App Router, TypeScript strict, Zod, Supabase, Tailwind CSS, next/font (Space Grotesk + IBM Plex Sans), vitest + React Testing Library (engine-admin only — no other package has a test runner).

## Global Constraints

- British English everywhere in user-facing text. No em dashes (—) anywhere in copy. (CLAUDE.md rule 5)
- `packages/engine-contracts` holds Zod schemas/types only, zero runtime deps. (CLAUDE.md rule 4)
- Apps never query Supabase directly; all data access goes through `engine-cms`. (CLAUDE.md rule 3)
- Never import from `/apps` inside `/packages`. (CLAUDE.md rule 2)
- Every table gets RLS from day one, no exceptions. (CLAUDE.md rule 8)
- Each task must leave the whole monorepo compiling (`pnpm typecheck` clean) before moving to the next. (CLAUDE.md rule 6)
- Content copy follows the stop-slop rules (active voice, no filler/adverbs, no em dashes, vary rhythm, put the reader in the room) and the Draupnir brand voice ("precise, not stiff; earned, not hyped").
- Spec: `docs/superpowers/specs/2026-08-05-draupnir-capital-design.md`.

---

## Task 1: Generalize CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite the title and opening paragraph**

Replace lines 1–7:

```markdown
# CLAUDE.md — Business Site Engine

You are working on a reusable engine that powers marketing sites for small and professional-services businesses. This file is the source of truth. Read it fully before doing anything. If a request conflicts with the rules here, stop and say so rather than proceeding.

## What this project is

One reusable engine (the "70%") built once and shared across every client. Each individual client is a separate app that consumes the engine and wears its own bespoke design (the "skin"). The engine is design-agnostic. Bespoke design is never baked into the engine. Vertical-specific needs (for example the swim schools' booking/billing module) are built as optional modules on top of the shared engine, switched on only for the clients that need them, never assumed universal.
```

- [ ] **Step 2: Update the block type list (line 60–62) to twelve**

```markdown
## The twelve CMS block types (the complete list — do not add more)

hero, rich_text, image, gallery, timetable, pricing_table, faq, team, cta_banner, contact, stats, feature_grid. Each has a Zod schema in engine-contracts. Content that fails validation cannot be saved.
```

- [ ] **Step 3: Update admin panel principles (line 64–66)**

```markdown
## Admin panel principles

Admins can: edit block content, reorder blocks, toggle published state, upload images, edit site settings, send a broadcast, view bookings (if module enabled). Admins cannot: create block types, edit layout, change design/fonts/colours, or see any code. The admin UI is generic and identical across clients; never restyle it per client. Every destructive action confirms first.
```

- [ ] **Step 4: Update the repository structure comment (line 55)**

Change `│   └── (schools added later, each its own skin)` to `│   └── (clients added later, each its own skin)`.

- [ ] **Step 5: Update v1 scope wording (lines 22–25) and locked stack (lines 35, 39)**

Change "non-technical school admins" → "non-technical client admins"; "switched on per school" → "switched on per client"; "one project per school" → "one project per client" (both occurrences, database and hosting lines).

- [ ] **Step 6: Leave the locked build order (lines 68–79) and working style (81–87) untouched**

They describe history and process, not swim-specific scope; no edit needed.

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: generalize CLAUDE.md beyond swim schools

Reflects the owner's explicit decision to keep one shared engine for
any client, with vertical-specific modules (like booking) built on
top only when needed."
```

---

## Task 2: Rename `schoolName`/`school_name` to `businessName`/`business_name` engine-wide

This is a single atomic task: the monorepo will not typecheck with the rename half-applied (the field is threaded through `engine-contracts` → `engine-db` → `engine-cms` → `engine-admin` → `engine-email` → every app), so every file lands in one commit.

**Files (all 27, confirmed by `grep -r "schoolName\|school_name"` across the repo excluding node_modules/dist):**
- Modify: `packages/engine-contracts/src/content/site-settings.ts`
- Modify: `packages/engine-cms/src/settings.ts`
- Modify: `packages/engine-db/src/database.types.ts`
- Modify: `packages/engine-db/supabase/migrations/20260710090000_initial_schema.sql` (comment/column only — see note below)
- Create: `packages/engine-db/supabase/migrations/20260805130000_rename_school_name.sql`
- Modify: `packages/engine-db/supabase/seed.sql`
- Modify: `packages/engine-admin/src/components/HomeScreen.tsx`
- Modify: `packages/engine-admin/src/components/HomeScreen.test.tsx`
- Modify: `packages/engine-admin/src/components/SettingsScreen.tsx`
- Modify: `packages/engine-email/src/templates/layout.tsx`
- Modify: `packages/engine-email/src/templates/broadcast.tsx`
- Modify: `packages/engine-email/src/templates/enquiry-notification.tsx`
- Modify: `packages/engine-email/src/templates/enquiry-received.tsx`
- Modify: `packages/engine-email/src/client.tsx`
- Modify: `apps/octoworks/db/setup.sql`, `apps/octoworks/db/seed.sql`, `apps/octoworks/app/[slug]/page.tsx`, `apps/octoworks/app/page.tsx`, `apps/octoworks/components/PublicShell.tsx`
- Modify: `apps/practice/db/setup.sql`, `apps/practice/db/seed.sql`, `apps/practice/app/[slug]/page.tsx`, `apps/practice/app/page.tsx`, `apps/practice/components/PublicShell.tsx`
- Modify: `apps/splashnswim/db/seed.sql`, `apps/splashnswim/app/admin/page.tsx`

**Interfaces:**
- Produces: `SiteSettings.businessName: string` (was `schoolName`), DB column `site_settings.business_name` (was `school_name`), `HomeScreenProps.businessName`, `EmailLayout`/email template prop `businessName`.

- [ ] **Step 1: Script the identifier rename across every file above**

Run from the repo root (Git Bash):

```bash
FILES=(
  "packages/engine-contracts/src/content/site-settings.ts"
  "packages/engine-cms/src/settings.ts"
  "packages/engine-db/src/database.types.ts"
  "packages/engine-db/supabase/migrations/20260710090000_initial_schema.sql"
  "packages/engine-db/supabase/seed.sql"
  "packages/engine-admin/src/components/HomeScreen.tsx"
  "packages/engine-admin/src/components/HomeScreen.test.tsx"
  "packages/engine-admin/src/components/SettingsScreen.tsx"
  "packages/engine-email/src/templates/layout.tsx"
  "packages/engine-email/src/templates/broadcast.tsx"
  "packages/engine-email/src/templates/enquiry-notification.tsx"
  "packages/engine-email/src/templates/enquiry-received.tsx"
  "packages/engine-email/src/client.tsx"
  "apps/octoworks/db/setup.sql" "apps/octoworks/db/seed.sql"
  "apps/octoworks/app/[slug]/page.tsx" "apps/octoworks/app/page.tsx"
  "apps/octoworks/components/PublicShell.tsx"
  "apps/practice/db/setup.sql" "apps/practice/db/seed.sql"
  "apps/practice/app/[slug]/page.tsx" "apps/practice/app/page.tsx"
  "apps/practice/components/PublicShell.tsx"
  "apps/splashnswim/db/seed.sql" "apps/splashnswim/app/admin/page.tsx"
)
for f in "${FILES[@]}"; do
  sed -i 's/schoolName/businessName/g; s/school_name/business_name/g' "$f"
done
```

- [ ] **Step 2: Fix the human-readable "school" copy the rename doesn't catch**

In `packages/engine-admin/src/components/SettingsScreen.tsx`, change the card heading `"School details"` → `"Business details"` and the label `"School name"` → `"Business name"`. In the same file's booking-module description, change `"for your school yet"` → `"for your business yet"` and `"set up separately for your school"` → `"set up separately for your business"`.

In `packages/engine-admin/src/components/HomeScreen.tsx`, the copy `Here is how the {businessName} website looks today.` needs no further change (already generic once the prop is renamed).

- [ ] **Step 3: Add the doc comments' wording fix**

In `packages/engine-contracts/src/content/site-settings.ts`, change the doc comment `"a school admin can edit"` → `"a client admin can edit"`. In `packages/engine-cms/src/settings.ts`, no prose comments reference "school" (only the identifier, already renamed by the script).

- [ ] **Step 4: Write the DB migration for existing deployed projects**

Create `packages/engine-db/supabase/migrations/20260805130000_rename_school_name.sql`:

```sql
-- Renames site_settings.school_name to business_name, following the
-- engine's generalization beyond swim schools only. Safe to run more than
-- once (guarded by a column-existence check).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'site_settings'
      and column_name = 'school_name'
  ) then
    alter table public.site_settings rename column school_name to business_name;
  end if;
end $$;
```

This file lives in `engine-db` (the source of truth for schema) so a fresh `setup.sql` for a brand-new client already has `business_name` from the start (Step 1's sed already renamed the column in `apps/*/db/setup.sql`, which are point-in-time full-schema scripts, not incremental migrations). **This migration must be run manually by the site owner against every already-live Supabase project** (`practice`, `octoworks` if provisioned, and `splashnswim`, which is real production) — do not run it automatically against any project from this session.

- [ ] **Step 5: Typecheck the whole monorepo**

Run: `pnpm typecheck`
Expected: no errors. If any remain, they will be TypeScript complaints about a stray `schoolName` reference the sed script's file list missed — grep again (`grep -rn "schoolName\|school_name" --include="*.ts" --include="*.tsx" --include="*.sql" . -- ':!node_modules' ':!dist'`) and fix.

- [ ] **Step 6: Run the engine-admin test suite**

Run: `pnpm --filter @swim-engine/engine-admin test`
Expected: PASS (HomeScreen.test.tsx's `schoolName="SplashNSwim"` prop was renamed to `businessName="SplashNSwim"` by the script; if the test file wasn't matched exactly, fix by hand).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: rename schoolName/school_name to businessName/business_name

Removes the last swim-specific identifier from the shared contract,
following the CLAUDE.md generalization. Includes a guarded migration
for already-deployed Supabase projects (must be run manually by the
owner against practice/octoworks/splashnswim)."
```

---

## Task 3: Add `stats` and `feature_grid` block types to engine-contracts

**Files:**
- Create: `packages/engine-contracts/src/blocks/stats.ts`
- Create: `packages/engine-contracts/src/blocks/feature-grid.ts`
- Modify: `packages/engine-contracts/src/blocks/index.ts`

**Interfaces:**
- Produces: `statsBlockSchema`/`StatsBlock`/`statItemSchema`/`StatItem`, `featureGridBlockSchema`/`FeatureGridBlock`/`featureItemSchema`/`FeatureItem`, both added to `BLOCK_TYPES` and the `blockSchema` discriminated union.
- Consumes: `blockBaseSchema` from `../shared.js` (Task not needed — already exists).

- [ ] **Step 1: Create `stats.ts`**

```ts
import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** One number in a stats row. */
export const statItemSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
});
export type StatItem = z.infer<typeof statItemSchema>;

/** Stats: a row of callout numbers, for example results or a track record. */
export const statsBlockSchema = blockBaseSchema.extend({
  type: z.literal("stats"),
  heading: z.string().optional(),
  items: z.array(statItemSchema).min(1),
});
export type StatsBlock = z.infer<typeof statsBlockSchema>;
```

- [ ] **Step 2: Create `feature-grid.ts`**

```ts
import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** One card in a feature grid. */
export const featureItemSchema = z.object({
  // Key into a small, fixed icon set (a lucide-react name) that engine-admin
  // offers as a dropdown, never free-text design input.
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
});
export type FeatureItem = z.infer<typeof featureItemSchema>;

/**
 * Feature grid: a grid of cards. Set `numbered` for a sequential process
 * (for example "how it works"); leave it off for an unordered set of
 * highlights (for example services or facility types).
 */
export const featureGridBlockSchema = blockBaseSchema.extend({
  type: z.literal("feature_grid"),
  heading: z.string().optional(),
  numbered: z.boolean().default(false),
  items: z.array(featureItemSchema).min(1),
});
export type FeatureGridBlock = z.infer<typeof featureGridBlockSchema>;
```

- [ ] **Step 3: Register both in `blocks/index.ts`**

```ts
import { z } from "zod";

import { heroBlockSchema } from "./hero.js";
import { richTextBlockSchema } from "./rich-text.js";
import { imageBlockSchema } from "./image.js";
import { galleryBlockSchema } from "./gallery.js";
import { timetableBlockSchema } from "./timetable.js";
import { pricingTableBlockSchema } from "./pricing-table.js";
import { faqBlockSchema } from "./faq.js";
import { teamBlockSchema } from "./team.js";
import { ctaBannerBlockSchema } from "./cta-banner.js";
import { contactBlockSchema } from "./contact.js";
import { statsBlockSchema } from "./stats.js";
import { featureGridBlockSchema } from "./feature-grid.js";

export * from "./hero.js";
export * from "./rich-text.js";
export * from "./image.js";
export * from "./gallery.js";
export * from "./timetable.js";
export * from "./pricing-table.js";
export * from "./faq.js";
export * from "./team.js";
export * from "./cta-banner.js";
export * from "./contact.js";
export * from "./stats.js";
export * from "./feature-grid.js";

/**
 * The complete, closed list of block types. Additions are a deliberate
 * engine change, never added ad hoc.
 */
export const BLOCK_TYPES = [
  "hero",
  "rich_text",
  "image",
  "gallery",
  "timetable",
  "pricing_table",
  "faq",
  "team",
  "cta_banner",
  "contact",
  "stats",
  "feature_grid",
] as const;

/**
 * A block is exactly one of the twelve types, chosen by its `type` field.
 * Any content that does not match one of these cannot be saved.
 */
export const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  richTextBlockSchema,
  imageBlockSchema,
  galleryBlockSchema,
  timetableBlockSchema,
  pricingTableBlockSchema,
  faqBlockSchema,
  teamBlockSchema,
  ctaBannerBlockSchema,
  contactBlockSchema,
  statsBlockSchema,
  featureGridBlockSchema,
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
```

- [ ] **Step 4: Typecheck and build engine-contracts**

Run: `pnpm --filter @swim-engine/engine-contracts build`
Expected: compiles clean. This will surface every downstream package/app whose exhaustive `switch (block.type)` no longer covers all cases — that's Tasks 4 and 5.

- [ ] **Step 5: Commit**

```bash
git add packages/engine-contracts
git commit -m "feat(engine-contracts): add stats and feature_grid block types

Deliberate engine change (CLAUDE.md's own stated bar for adding a
block type), needed for Draupnir Capital's stat callouts and
icon-card sections. Both are vertical-neutral, not finance-specific."
```

---

## Task 4: Wire the new block types into engine-admin

**Files:**
- Modify: `packages/engine-admin/src/icons.ts`
- Modify: `packages/engine-admin/src/labels.ts`
- Modify: `packages/engine-admin/src/components/blocks/editors.tsx`
- Create: `packages/engine-admin/src/components/blocks/editors.test.tsx`

**Interfaces:**
- Consumes: `StatsBlock`, `FeatureGridBlock` from `@swim-engine/engine-contracts` (Task 3). `TextField`, `TextAreaField`, `SelectField`, `Toggle`, `Row`, `RowList` from `../ui.js` (existing). `removeAt`, `replaceAt` from `../../array.js` (existing).
- Produces: `BlockFields` now renders `StatsEditor`/`FeatureGridEditor` for those types; `BLOCK_LABELS`, `BLOCK_ICONS`, `createBlock` cover all twelve types.

- [ ] **Step 1: Add the new lucide icons to `icons.ts`, and re-export them from `index.ts`**

Add to the existing re-export list in `packages/engine-admin/src/icons.ts` (after `Clock`):

```ts
  TrendingUp,
  LayoutGrid,
  Key,
  Landmark,
  Shield,
  Handshake,
  CheckCircle,
  Globe,
  Layers,
```

(`Users` and `FileText` are already exported there.)

`packages/engine-admin/src/index.ts` re-exports a curated subset of `icons.ts` for consuming apps to use (it does not `export *`) — apps/draupnir-capital's `PublicBlocks.tsx` (Task 7) needs the feature-icon set to render `feature_grid` cards, so add the same nine names to `index.ts`'s existing icon export block (the one starting `export { Home, FileText, ImageIcon, ...`):

```ts
  TrendingUp,
  LayoutGrid,
  Key,
  Landmark,
  Shield,
  Handshake,
  CheckCircle,
  Globe,
  Layers,
```

(insert before the closing `} from "./icons.js";`).

- [ ] **Step 2: Define the fixed feature-icon set and update `labels.ts`**

In `packages/engine-admin/src/labels.ts`, add near the top (after imports):

```ts
/** The fixed set of icons an admin may choose for a feature_grid card. */
export const FEATURE_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "key", label: "Key" },
  { value: "landmark", label: "Landmark" },
  { value: "shield", label: "Shield" },
  { value: "trending-up", label: "Trending up" },
  { value: "handshake", label: "Handshake" },
  { value: "check-circle", label: "Check" },
  { value: "file-text", label: "Document" },
  { value: "globe", label: "Globe" },
  { value: "layers", label: "Layers" },
  { value: "users", label: "People" },
];
```

Update the `icons.js` import line to include `TrendingUp, LayoutGrid`. Update `BLOCK_LABELS`:

```ts
export const BLOCK_LABELS: Record<Block["type"], string> = {
  hero: "Hero banner",
  rich_text: "Text",
  image: "Image",
  gallery: "Gallery",
  timetable: "Timetable",
  pricing_table: "Pricing table",
  faq: "Frequently asked questions",
  team: "Team",
  cta_banner: "Call to action",
  contact: "Contact details",
  stats: "Stats",
  feature_grid: "Feature grid",
};
```

Update `createBlock`'s switch, adding two cases before `default`:

```ts
    case "stats":
      return { id, type, items: [{ value: "100", label: "New stat" }] };
    case "feature_grid":
      return { id, type, numbered: false, items: [{ title: "New feature" }] };
```

Update `BLOCK_ICONS`:

```ts
export const BLOCK_ICONS: Record<Block["type"], ComponentType<{ className?: string }>> = {
  hero: ImageIcon,
  rich_text: FileText,
  image: ImageIcon,
  gallery: Images,
  timetable: CalendarClock,
  pricing_table: PoundSterling,
  faq: HelpCircle,
  team: Users,
  cta_banner: Megaphone,
  contact: Phone,
  stats: TrendingUp,
  feature_grid: LayoutGrid,
};
```

(Add `TrendingUp, LayoutGrid` to that file's `./icons.js` import too.)

- [ ] **Step 3: Add `StatsEditor` and `FeatureGridEditor` to `editors.tsx`**

Add these two imports to the top of `packages/engine-admin/src/components/blocks/editors.tsx`'s type-only import block: `StatsBlock`, `StatItem`, `FeatureGridBlock`, `FeatureItem`. Add `FEATURE_ICON_OPTIONS` to the import from `../labels.js` (new import line, since `editors.tsx` currently doesn't import from `labels.js` — add `import { FEATURE_ICON_OPTIONS } from "../labels.js";`).

Insert these two functions after `TeamEditor` (before `CtaBannerEditor`):

```tsx
function StatsEditor({
  block,
  onChange,
}: {
  block: StatsBlock;
  onChange: (block: StatsBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <RowList
        addLabel="Add stat"
        onAdd={() =>
          onChange({ ...block, items: [...block.items, { value: "100", label: "New stat" }] })
        }
      >
        {block.items.map((item, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, items: removeAt(block.items, index) })}
          >
            <TextField
              label="Value (as shown, for example $3.5Bn+)"
              value={item.value}
              onChange={(v) =>
                onChange({ ...block, items: replaceAt(block.items, index, { ...item, value: v }) })
              }
            />
            <TextField
              label="Label"
              value={item.label}
              onChange={(v) =>
                onChange({ ...block, items: replaceAt(block.items, index, { ...item, label: v }) })
              }
            />
            <TextAreaField
              label="Description (optional)"
              value={item.description ?? ""}
              onChange={(v) =>
                onChange({
                  ...block,
                  items: replaceAt(block.items, index, {
                    ...item,
                    description: v === "" ? undefined : v,
                  }),
                })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}

function FeatureGridEditor({
  block,
  onChange,
}: {
  block: FeatureGridBlock;
  onChange: (block: FeatureGridBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Heading (optional)"
        value={block.heading ?? ""}
        onChange={(v) => onChange({ ...block, heading: v === "" ? undefined : v })}
      />
      <Toggle
        label="Number these cards (for a step-by-step process)"
        checked={block.numbered}
        onChange={(checked) => onChange({ ...block, numbered: checked })}
      />
      <RowList
        addLabel="Add card"
        onAdd={() => onChange({ ...block, items: [...block.items, { title: "New feature" }] })}
      >
        {block.items.map((item, index) => (
          <Row
            key={index}
            onRemove={() => onChange({ ...block, items: removeAt(block.items, index) })}
          >
            <SelectField
              label="Icon (optional)"
              value={item.icon ?? ""}
              options={[{ value: "", label: "No icon" }, ...FEATURE_ICON_OPTIONS]}
              onChange={(v) =>
                onChange({
                  ...block,
                  items: replaceAt(block.items, index, { ...item, icon: v === "" ? undefined : v }),
                })
              }
            />
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) =>
                onChange({ ...block, items: replaceAt(block.items, index, { ...item, title: v }) })
              }
            />
            <TextAreaField
              label="Description (optional)"
              value={item.description ?? ""}
              onChange={(v) =>
                onChange({
                  ...block,
                  items: replaceAt(block.items, index, {
                    ...item,
                    description: v === "" ? undefined : v,
                  }),
                })
              }
            />
          </Row>
        ))}
      </RowList>
    </div>
  );
}
```

Add two cases to `BlockFields`'s switch, before `default`:

```tsx
    case "stats":
      return <StatsEditor block={block} onChange={onChange} />;
    case "feature_grid":
      return <FeatureGridEditor block={block} onChange={onChange} />;
```

- [ ] **Step 4: Write `editors.test.tsx`**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StatsBlock, FeatureGridBlock } from "@swim-engine/engine-contracts";
import { BlockFields } from "./editors.js";

describe("StatsEditor", () => {
  it("renders each stat's value and label", () => {
    const block: StatsBlock = {
      id: "b1",
      type: "stats",
      items: [{ value: "$3.5Bn+", label: "Mandated" }],
    };
    render(<BlockFields block={block} onChange={() => {}} />);
    expect(screen.getByDisplayValue("$3.5Bn+")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Mandated")).toBeInTheDocument();
  });

  it("adds a stat when 'Add stat' is clicked", async () => {
    const block: StatsBlock = { id: "b1", type: "stats", items: [{ value: "1", label: "One" }] };
    const onChange = vi.fn();
    render(<BlockFields block={block} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Add stat" }));
    expect(onChange).toHaveBeenCalledWith({
      ...block,
      items: [...block.items, { value: "100", label: "New stat" }],
    });
  });
});

describe("FeatureGridEditor", () => {
  it("renders each card's title", () => {
    const block: FeatureGridBlock = {
      id: "b1",
      type: "feature_grid",
      numbered: false,
      items: [{ title: "Capital Introduction" }],
    };
    render(<BlockFields block={block} onChange={() => {}} />);
    expect(screen.getByDisplayValue("Capital Introduction")).toBeInTheDocument();
  });

  it("toggles the numbered flag", async () => {
    const block: FeatureGridBlock = {
      id: "b1",
      type: "feature_grid",
      numbered: false,
      items: [{ title: "Structure" }],
    };
    const onChange = vi.fn();
    render(<BlockFields block={block} onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: /Number these cards/ }));
    expect(onChange).toHaveBeenCalledWith({ ...block, numbered: true });
  });
});
```

- [ ] **Step 5: Run the test and confirm it passes**

Run: `pnpm --filter @swim-engine/engine-admin test`
Expected: PASS, including the two new `describe` blocks. If `Toggle`'s underlying element isn't an accessible `checkbox` role, check `packages/engine-admin/src/components/ui.tsx`'s `Toggle` implementation and adjust the query (e.g. `getByLabelText`) to match.

- [ ] **Step 6: Typecheck engine-admin**

Run: `pnpm --filter @swim-engine/engine-admin typecheck`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add packages/engine-admin
git commit -m "feat(engine-admin): add editors for stats and feature_grid blocks"
```

---

## Task 5: Add renderer cases for the new blocks to every existing app

Without this, `pnpm typecheck` fails everywhere: each app's `PublicBlocks.tsx` ends with `const unreachable: never = block`, which no longer compiles once the union has two more members it doesn't handle — even though `splashnswim`/`practice` never use these block types in their own content.

**Files:**
- Modify: `apps/octoworks/components/PublicBlocks.tsx`
- Modify: `apps/practice/components/PublicBlocks.tsx`
- Modify: `apps/splashnswim/components/PublicBlocks.tsx`

**Interfaces:**
- Consumes: `Block` (now includes `stats`/`feature_grid`) from `@swim-engine/engine-contracts`.

- [ ] **Step 1: Add plain cases to `apps/octoworks/components/PublicBlocks.tsx` and `apps/practice/components/PublicBlocks.tsx`**

In both files (identical content), insert before the `default: {` line inside `renderBlock`:

```tsx
    case "stats":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <div className="grid gap-4 sm:grid-cols-3">
            {block.items.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold">{item.value}</p>
                <p className="text-sm text-slate-600">{item.label}</p>
                {item.description ? (
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );
    case "feature_grid":
      return (
        <div>
          {block.heading ? <h2 className="mb-3 text-2xl font-semibold">{block.heading}</h2> : null}
          <div className="grid gap-4 sm:grid-cols-3">
            {block.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-slate-200 p-4">
                {block.numbered ? (
                  <p className="text-sm font-semibold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                ) : null}
                <h3 className="font-semibold">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      );
```

- [ ] **Step 2: Add styled cases to `apps/splashnswim/components/PublicBlocks.tsx`**

Insert before the `default: {` line (after the existing `case "contact":` block, using that file's existing `Container`/`Heading` helpers and brand tokens):

```tsx
    case "stats":
      return (
        <div className="bg-ink">
          <Container>
            {block.heading ? <Heading className="text-surface">{block.heading}</Heading> : null}
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {block.items.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="font-display text-4xl font-bold text-surface">{item.value}</p>
                  <p className="mt-2 text-sm text-surface/70">{item.label}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs text-surface/50">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </div>
      );

    case "feature_grid":
      return (
        <Container>
          {block.heading ? <Heading className="text-ink">{block.heading}</Heading> : null}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {block.items.map((item, index) => (
              <div key={index} className="rounded-3xl border-2 border-foam bg-surface p-6">
                {block.numbered ? (
                  <p className="font-display text-sm font-bold text-coral">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                ) : null}
                <p className="mt-2 font-display text-lg font-bold text-ink">{item.title}</p>
                {item.description ? (
                  <p className="mt-2 text-sm text-slate">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      );
```

- [ ] **Step 3: Typecheck and build every app**

Run: `pnpm typecheck && pnpm build`
Expected: clean across the whole monorepo — this is the checkpoint that confirms Tasks 3–5 landed completely.

- [ ] **Step 4: Commit**

```bash
git add apps/octoworks/components/PublicBlocks.tsx apps/practice/components/PublicBlocks.tsx apps/splashnswim/components/PublicBlocks.tsx
git commit -m "feat: render stats and feature_grid blocks in every existing skin

Required for the monorepo to typecheck now that the block union has
grown to twelve members, independent of whether a given skin's
content actually uses the two new types yet."
```

---

## Task 6: Scaffold `apps/draupnir-capital`

**Files:**
- Create: `apps/draupnir-capital/` (cloned from `apps/octoworks/`, see Step 1)
- Modify (post-clone): `package.json`, `.env.local.example`, `README.md`, `app/layout.tsx`, `app/[slug]/page.tsx`, `app/page.tsx`, `components/PublicShell.tsx`, `lib/actions.ts`, `tailwind.config.ts`

- [ ] **Step 1: Clone the octoworks scaffold**

```bash
cp -r apps/octoworks apps/draupnir-capital
rm -rf apps/draupnir-capital/node_modules apps/draupnir-capital/tsconfig.tsbuildinfo
```

This carries over (unchanged, already generic): `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `middleware.ts`, `vercel.json`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/public.ts`, `app/login/page.tsx`, `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/pages/page.tsx`, `app/admin/pages/[id]/page.tsx`, `app/admin/media/page.tsx`, `app/admin/settings/page.tsx`, `app/admin/broadcast/page.tsx`, `components/EnquiryForm.tsx`, `components/PublicBlocks.tsx` (replaced in Task 7), `db/setup.sql` (already has `business_name` from Task 2's rename), `db/seed.sql` (replaced in Task 8).

- [ ] **Step 2: Rename the package**

In `apps/draupnir-capital/package.json`, change `"name": "octoworks"` → `"name": "draupnir-capital"` and `"description"` → `"Draupnir Capital: bespoke design on top of the shared engine."`.

- [ ] **Step 3: Update `README.md`**

```markdown
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
```

- [ ] **Step 4: Update `.env.local.example`'s header comment**

Change the top comment's project reference from generic to Draupnir-specific: `# Copy this file to .env.local and fill in the values from Draupnir Capital's` / `# own Supabase project.` (wording only, no functional change).

- [ ] **Step 5: Update `lib/actions.ts`'s placeholder addresses**

```ts
const NOTIFY_EMAIL = "boris@draupnir.capital";
```

Leave `BROADCAST_RECIPIENTS` as-is (Draupnir has no parent mailing list; the broadcast screen stays present per the generic admin panel but unused).

- [ ] **Step 6: Rewrite `tailwind.config.ts` with Draupnir's brand tokens and fonts**

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/engine-admin/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "rgb(var(--color-brand-dark) / <alpha-value>)",
        "brand-mid": "rgb(var(--color-brand-mid) / <alpha-value>)",
        "brand-light": "rgb(var(--color-brand-light) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 7: Create `app/globals.css`** (octoworks has none — it relies on bare Tailwind; Draupnir needs the brand token layer)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * Draupnir Capital - official brand palette (Brand Guidelines, July 2026).
 * Tokens are RGB channels so opacity modifiers work.
 */
:root {
  --color-brand-dark: 79 12 32;    /* Bordeaux Dark #4F0C20 */
  --color-brand-mid: 140 25 60;    /* Bordeaux Mid #8C193C */
  --color-brand-light: 174 61 95;  /* Bordeaux Light #AE3D5F */
  --color-ink: 25 25 28;           /* Near Black #19191C */
  --color-surface: 255 255 255;
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
}

h1, h2, h3, .font-display {
  font-family: var(--font-display), system-ui, sans-serif;
}
```

- [ ] **Step 8: Rewrite `app/layout.tsx` with Space Grotesk + IBM Plex Sans and Draupnir metadata**

```tsx
import type { ReactNode } from "react";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Draupnir Capital | Gateway to Private Credit",
  description:
    "Institutional private credit for Web3 and DLT-driven businesses. Draupnir Capital structures non-bank credit facilities and places them directly with institutional lenders.",
  openGraph: {
    title: "Draupnir Capital | Gateway to Private Credit",
    description: "Institutional private credit for Web3 and DLT-driven businesses.",
    siteName: "Draupnir Capital",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body className="bg-surface text-ink">{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Update the fallback business name in `app/[slug]/page.tsx` and `app/page.tsx`**

Task 2 already renamed the `schoolName`/`businessName` identifiers everywhere, including in `apps/octoworks` before it was cloned in Step 1 — so both files already read `settings?.businessName ?? "OctoWorks"` and pass `businessName={...}` to `PublicShell`. The only remaining change is the fallback string itself: in `app/[slug]/page.tsx`, change `settings?.businessName ?? "OctoWorks"` to `settings?.businessName ?? "Draupnir Capital"`. In `app/page.tsx`, change `const businessName = settings?.businessName ?? "OctoWorks";` to `const businessName = settings?.businessName ?? "Draupnir Capital";`.

- [ ] **Step 10: Typecheck (expected to still fail on `PublicShell`/`PublicBlocks` until Task 7)**

Run: `pnpm --filter draupnir-capital typecheck`
Expected: errors in `components/PublicShell.tsx` (still has `schoolName` prop name) and `components/PublicBlocks.tsx` (plain octoworks version, fine as an interim state) — both resolved in Task 7. Do not commit yet; Task 7 is the same logical unit finishing this scaffold.

---

## Task 7: Build Draupnir's branded `PublicShell` and `PublicBlocks`

**Files:**
- Modify: `apps/draupnir-capital/components/PublicShell.tsx`
- Modify: `apps/draupnir-capital/components/PublicBlocks.tsx`
- Modify: `apps/draupnir-capital/components/EnquiryForm.tsx`
- Create: `apps/draupnir-capital/public/brand/` (logo files, see Step 1)

**Interfaces:**
- Consumes: `Block` (all twelve types) from `@swim-engine/engine-contracts`.
- Produces: `PublicShell({ businessName, children })`, `PublicBlocks({ blocks })`, matching the signatures every other skin uses (Task 6 Step 9 already updated the caller).

- [ ] **Step 1: Copy the logo assets into `public/brand/`**

```bash
mkdir -p apps/draupnir-capital/public/brand
cp "/c/Users/44737/AppData/Local/Temp/claude/C--Users-44737-Desktop-swim-engine/4a4fb21f-d8a7-4934-a7eb-7cc2d0fc65fa/scratchpad/draupnir/logos/draupnir_logo_bordeaux/SVG/horisontal_logo_bordeaux_gold.svg" apps/draupnir-capital/public/brand/
cp "/c/Users/44737/AppData/Local/Temp/claude/C--Users-44737-Desktop-swim-engine/4a4fb21f-d8a7-4934-a7eb-7cc2d0fc65fa/scratchpad/draupnir/logos/draupnir_logo_bordeaux/SVG/horisontal_logo_white_bordeaux.svg" apps/draupnir-capital/public/brand/
cp "/c/Users/44737/AppData/Local/Temp/claude/C--Users-44737-Desktop-swim-engine/4a4fb21f-d8a7-4934-a7eb-7cc2d0fc65fa/scratchpad/draupnir/logos/draupnir_logo_bordeaux/SVG/sign_bordeaux.svg" apps/draupnir-capital/public/brand/
cp "/c/Users/44737/AppData/Local/Temp/claude/C--Users-44737-Desktop-swim-engine/4a4fb21f-d8a7-4934-a7eb-7cc2d0fc65fa/scratchpad/draupnir/logos/draupnir_logo_bordeaux/PNG/sign_bordeaux.png" apps/draupnir-capital/public/favicon.png
```

(Adjust the source path if the scratchpad directory differs at execution time — the important part is the four target files: two horizontal lockups for the header/footer, the mark-only SVG for small placements, and a PNG mark for the favicon.)

- [ ] **Step 2: Rewrite `PublicShell.tsx`**

```tsx
import type { ReactNode } from "react";

const NAV_LINKS = [
  { href: "/what-we-do", label: "What We Do" },
  { href: "/our-work", label: "Our Work" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

/** The public site frame: branded header with nav, plain footer with an admin link. */
export function PublicShell({
  businessName,
  children,
}: {
  businessName: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/horisontal_logo_bordeaux_gold.svg" alt={businessName} className="h-8 w-auto" />
          </a>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-brand-mid">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-ink/10 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 text-xs text-ink/50">
          <span>{businessName}</span>
          <a href="/admin" className="hover:text-ink">Admin</a>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `PublicBlocks.tsx`** — full branded renderer, all twelve block types

```tsx
import type { ComponentType } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import {
  Key,
  Landmark,
  Shield,
  TrendingUp,
  Handshake,
  CheckCircle,
  FileText,
  Globe,
  Layers,
  Users,
} from "@swim-engine/engine-admin";
import { EnquiryForm } from "./EnquiryForm";

// Matches engine-admin's FEATURE_ICON_OPTIONS keys (the fixed set an admin
// can choose from). An unrecognised or absent key simply renders no icon.
const FEATURE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  key: Key,
  landmark: Landmark,
  shield: Shield,
  "trending-up": TrendingUp,
  handshake: Handshake,
  "check-circle": CheckCircle,
  "file-text": FileText,
  globe: Globe,
  layers: Layers,
  users: Users,
};

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-mid">{children}</p>
  );
}

/** Renders every block type in Draupnir Capital's bordeaux/near-black brand. */
export function PublicBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <section key={block.id}>{renderBlock(block)}</section>
      ))}
    </div>
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "hero":
      return (
        <div className="bg-ink text-surface">
          <Container>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
              {block.heading}
            </h1>
            {block.subheading ? (
              <p className="mt-4 max-w-xl text-lg text-surface/70">{block.subheading}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              {block.primaryCta ? (
                <a
                  href={block.primaryCta.href}
                  className="rounded-full bg-brand-mid px-6 py-3 text-sm font-semibold text-surface transition hover:bg-brand-light"
                >
                  {block.primaryCta.label}
                </a>
              ) : null}
              {block.secondaryCta ? (
                <a
                  href={block.secondaryCta.href}
                  className="rounded-full border border-surface/30 px-6 py-3 text-sm font-semibold text-surface transition hover:border-surface"
                >
                  {block.secondaryCta.label}
                </a>
              ) : null}
            </div>
          </Container>
        </div>
      );

    case "rich_text":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-3xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-4 max-w-2xl space-y-4 whitespace-pre-wrap text-base leading-relaxed text-ink/80">
            {block.content}
          </div>
        </Container>
      );

    case "stats":
      return (
        <div className="bg-ink text-surface">
          <Container>
            {block.heading ? (
              <h2 className="font-display text-2xl font-bold">{block.heading}</h2>
            ) : null}
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {block.items.map((item, index) => (
                <div key={index}>
                  <p className="font-display text-4xl font-bold">{item.value}</p>
                  <p className="mt-2 text-sm text-surface/70">{item.label}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs text-surface/50">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </div>
      );

    case "feature_grid":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {block.items.map((item, index) => {
              const Icon = item.icon ? FEATURE_ICONS[item.icon] : undefined;
              return (
                <div key={index} className="rounded-2xl border border-ink/10 p-6">
                  {block.numbered ? (
                    <Eyebrow>{String(index + 1).padStart(2, "0")}</Eyebrow>
                  ) : Icon ? (
                    <Icon className="h-6 w-6 text-brand-mid" />
                  ) : null}
                  <p className="mt-2 font-display text-lg font-bold text-ink">{item.title}</p>
                  {item.description ? (
                    <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Container>
      );

    case "team":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {block.members.map((member, index) => (
              <div key={index} className="rounded-2xl border border-ink/10 p-6">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo.src}
                    alt={member.photo.alt}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : null}
                <p className="mt-4 font-display text-lg font-bold text-ink">{member.name}</p>
                <p className="text-sm text-brand-mid">{member.role}</p>
                {member.bio ? <p className="mt-3 text-sm text-ink/70">{member.bio}</p> : null}
              </div>
            ))}
          </div>
        </Container>
      );

    case "cta_banner":
      return (
        <div className="bg-brand-dark text-surface">
          <Container>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold">{block.heading}</h2>
              {block.body ? (
                <p className="mx-auto mt-3 max-w-xl text-surface/70">{block.body}</p>
              ) : null}
              <a
                href={block.cta.href}
                className="mt-6 inline-block rounded-full bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface/90"
              >
                {block.cta.label}
              </a>
            </div>
          </Container>
        </div>
      );

    case "contact":
      return (
        <Container>
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              {block.heading ? (
                <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
              ) : null}
              <div className="mt-4 space-y-2 text-sm text-ink/70">
                {block.address ? <p>{block.address}</p> : null}
                {block.phone ? <p>{block.phone}</p> : null}
                {block.email ? (
                  <p>
                    <a href={`mailto:${block.email}`} className="font-semibold text-brand-mid hover:underline">
                      {block.email}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
            {block.showEnquiryForm ? <EnquiryForm /> : null}
          </div>
        </Container>
      );

    case "image":
      return (
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.image.src} alt={block.image.alt} className="w-full rounded-2xl" />
          {block.image.caption ? (
            <p className="mt-2 text-sm text-ink/60">{block.image.caption}</p>
          ) : null}
        </Container>
      );

    case "gallery":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {block.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={index} src={image.src} alt={image.alt} className="rounded-xl" />
            ))}
          </div>
        </Container>
      );

    case "timetable":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <table className="mt-6 w-full border-collapse text-left text-sm">
            <tbody>
              {block.sessions.map((session, index) => (
                <tr key={index} className="border-b border-ink/10">
                  <td className="py-2 pr-4 capitalize">{session.day}</td>
                  <td className="py-2 pr-4">{session.startTime}–{session.endTime}</td>
                  <td className="py-2 pr-4">{session.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      );

    case "pricing_table":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {block.tiers.map((tier, index) => (
              <div key={index} className="rounded-2xl border border-ink/10 p-6">
                <h3 className="font-display font-bold text-ink">{tier.name}</h3>
                <p className="mt-1 text-lg text-brand-mid">{tier.price}</p>
              </div>
            ))}
          </div>
        </Container>
      );

    case "faq":
      return (
        <Container>
          {block.heading ? (
            <h2 className="font-display text-2xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <dl className="mt-6 space-y-4">
            {block.items.map((item, index) => (
              <div key={index}>
                <dt className="font-semibold text-ink">{item.question}</dt>
                <dd className="mt-1 text-sm text-ink/70">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      );

    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
```

- [ ] **Step 4: Rebrand `EnquiryForm.tsx`'s submit button**

Change the submit `<button>`'s className from `"rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"` to `"rounded-full bg-brand-mid px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light disabled:opacity-50"`. No other change (the form's logic is generic and already correct).

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter draupnir-capital typecheck`
Expected: clean (resolves the Task 6 Step 10 errors).

- [ ] **Step 6: Commit**

```bash
git add apps/draupnir-capital
git commit -m "feat(draupnir-capital): scaffold app skeleton and branded rendering

Bordeaux/near-black palette, Space Grotesk + IBM Plex Sans, full
twelve-block-type renderer following the pattern established by
octoworks/practice/splashnswim."
```

---

## Task 8: Write Draupnir's real content

**Files:**
- Modify: `apps/draupnir-capital/db/seed.sql`

- [ ] **Step 1: Replace `db/seed.sql` with Draupnir's five pages**

```sql
-- ==========================================================================
-- Real content for Draupnir Capital. Run this after setup.sql. It is safe
-- to run more than once (existing rows are kept).
-- ==========================================================================

insert into public.site_settings (id, business_name, contact_email, contact_phone, booking_enabled)
values (
  true,
  'Draupnir Capital',
  'boris@draupnir.capital',
  null,
  false
)
on conflict (id) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'home',
  'Draupnir Capital | Gateway to Private Credit',
  true,
  '[
    {
      "id": "blk_hero",
      "type": "hero",
      "heading": "Gateway to Private Credit",
      "subheading": "Connecting non-dilutive credit to the businesses building the next financial system.",
      "primaryCta": { "label": "Let'\''s talk", "href": "/contact" },
      "secondaryCta": { "label": "What we do", "href": "/what-we-do" }
    },
    {
      "id": "blk_positioning",
      "type": "rich_text",
      "heading": "The bridge between institutional credit and Web3",
      "content": "Draupnir Capital connects institutional private credit markets with the Web3 and DLT-driven businesses ready to meet them. We structure non-bank credit, asset-backed facilities and DLT-enhanced deals, then put founders directly in front of the lenders who fund them.\n\nPrivate credit has grown into a $3.5 trillion asset class. Most fintech and Web3 businesses do not know they qualify for it. Most placement agents cannot speak both languages. We can."
    },
    {
      "id": "blk_stats",
      "type": "stats",
      "heading": "Numbers that hold up on a call",
      "items": [
        { "value": "$3.5Bn+", "label": "Term sheets mandated on", "description": "Total facility value structured and mandated on since inception." },
        { "value": "$500M+", "label": "Term sheet value obtained", "description": "Signed term sheets converted into active mandates with institutional lenders." },
        { "value": "12", "label": "Individual mandates to date", "description": "Distinct transactions, each engaged on directly by the Draupnir team." }
      ]
    },
    {
      "id": "blk_what_we_do",
      "type": "feature_grid",
      "heading": "Two things, done properly, for one purpose",
      "numbered": false,
      "items": [
        { "icon": "key", "title": "Capital Introduction", "description": "Direct introductions to the institutional lenders, private credit funds and alternative lenders who actually fund deals in this space, sourced from our own network." },
        { "icon": "landmark", "title": "Deal Structuring", "description": "We shape the right facility for your business and stage, then run point on terms, diligence and documentation so the process moves at institutional speed." }
      ]
    },
    {
      "id": "blk_cta",
      "type": "cta_banner",
      "heading": "Let'\''s talk",
      "body": "If this looks like a fit, the next step is a short call to talk through your facility and timeline.",
      "cta": { "label": "Get in touch", "href": "/contact" }
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'what-we-do',
  'What We Do | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_how",
      "type": "feature_grid",
      "heading": "From first conversation to funded, in three moves",
      "numbered": true,
      "items": [
        { "icon": "landmark", "title": "Structure", "description": "We position your business to meet what institutional private credit investors actually look for. Asset eligibility, facility type and security package are defined before a single lender call." },
        { "icon": "key", "title": "Access", "description": "We introduce you directly to the right private credit funds and lenders for your specific facility, drawn from an active network across six regions." },
        { "icon": "check-circle", "title": "Execution", "description": "We manage the process end to end, from term sheet through to close, with one point of contact through legal structuring, KYC and first drawdown." }
      ]
    },
    {
      "id": "blk_facilities",
      "type": "feature_grid",
      "heading": "Facility types built around the deal, not a template",
      "numbered": false,
      "items": [
        { "title": "Invoice Financing" },
        { "title": "Supply-Chain Financing" },
        { "title": "Trade Financing" },
        { "title": "Receivables Financing" },
        { "title": "AR/AP Financing" },
        { "title": "Payments Financing" },
        { "title": "Equipment Financing" }
      ]
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'our-work',
  'Our Work | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_stats_repeat",
      "type": "stats",
      "items": [
        { "value": "$3.5Bn+", "label": "Term sheets mandated on" },
        { "value": "$500M+", "label": "Term sheet value obtained" },
        { "value": "12", "label": "Individual mandates to date" }
      ]
    },
    {
      "id": "blk_case_study",
      "type": "rich_text",
      "heading": "BlackOpal · GemStone",
      "content": "In January 2026, Draupnir acted as Lead Advisor and Capital Introduction Partner on a $200 million three-year facility backing GemStone, BlackOpal'\''s institutional platform for tokenised Brazilian credit card receivables.\n\nBoris Redfern, Head of Capital Markets at Draupnir, said: \"By structurally mitigating credit risk, BlackOpal has created an investment-grade product that global allocators can scale into with confidence.\""
    },
    {
      "id": "blk_regions",
      "type": "feature_grid",
      "heading": "Six regions, one team that already knows the lenders in each",
      "numbered": false,
      "items": [
        { "title": "United Kingdom (HQ)", "description": "Home base, and where the network runs deepest." },
        { "title": "Europe (ex-Russia)", "description": "Live lender relationships across the continent." },
        { "title": "North America", "description": "Institutional credit and private fund relationships." },
        { "title": "Latin America", "description": "Structuring experience across the region'\''s credit markets." },
        { "title": "MENA", "description": "Active lender relationships across the Gulf and wider region." },
        { "title": "APAC", "description": "Reach into Asia-Pacific'\''s institutional lender base." }
      ]
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'team',
  'Team | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_team",
      "type": "team",
      "heading": "Two operators, one network",
      "members": [
        { "name": "Boris Redfern", "role": "Head of Capital Markets", "bio": "Over a decade in structured finance, with a deep network of non-bank lenders across Europe. Previously Head of Capital Markets at Kasu." },
        { "name": "Sebastian Cheek", "role": "Head of Operations & Investment", "bio": "Formerly Head of Investment at Faculty Group, where he led an active investment fund. Runs deal operations end to end at Draupnir." }
      ]
    }
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.pages (slug, title, published, blocks)
values (
  'contact',
  'Contact | Draupnir Capital',
  true,
  '[
    {
      "id": "blk_contact",
      "type": "contact",
      "heading": "Get in touch",
      "address": "84 Eccleston Square, Pimlico, London, SW1V 1PX, England",
      "email": "boris@draupnir.capital",
      "showEnquiryForm": true
    },
    {
      "id": "blk_disclaimer",
      "type": "rich_text",
      "heading": "Regulatory notice",
      "content": "Draupnir Capital Ltd (Company No. 16530781) is not licensed or authorised to provide financial, investment, or tax advice. Nothing on this website constitutes an offer, solicitation, or recommendation regarding any security or investment strategy. Recipients should seek independent professional advice before making any investment decision."
    }
  ]'::jsonb
)
on conflict (slug) do nothing;
```

- [ ] **Step 2: Commit**

```bash
git add apps/draupnir-capital/db/seed.sql
git commit -m "feat(draupnir-capital): write real page content

Five pages (Home, What We Do, Our Work, Team, Contact) sourced from
Draupnir's brand guidelines and pitch deck, written to the stop-slop
rules and the brand voice guide."
```

---

## Task 9: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck and build the whole monorepo**

Run: `pnpm typecheck && pnpm build`
Expected: clean across every package and app, including `splashnswim`, `practice`, `octoworks`, and `draupnir-capital`.

- [ ] **Step 2: Run every test suite**

Run: `pnpm test`
Expected: PASS (this covers `engine-admin`'s vitest suite, including the new `editors.test.tsx` from Task 4 and the renamed-prop `HomeScreen.test.tsx` from Task 2).

- [ ] **Step 3: Set up a Supabase project for Draupnir**

This step needs the site owner: create a new Supabase project, run `apps/draupnir-capital/db/setup.sql` then `db/seed.sql` in its SQL editor, create an admin user, and fill in `apps/draupnir-capital/.env.local` from `.env.local.example`.

- [ ] **Step 4: Start the dev server and browser-verify every page**

Start `pnpm --filter draupnir-capital dev`, open the Browser pane at `http://localhost:3000`, and check each route: `/`, `/what-we-do`, `/our-work`, `/team`, `/contact`. Confirm: logo renders in the header, brand colours and fonts are applied (not default Tailwind slate/system-ui), stats/feature_grid sections render correctly, the enquiry form on `/contact` submits (check the dev server terminal log for the "sent" output from the log emailer), and there are no console errors (`read_console_messages`).

- [ ] **Step 5: Browser-verify the admin panel**

Sign in at `/login`, open `/admin/pages`, edit the Home page, and confirm the `Stats` and `Feature grid` block types appear in the "Add a block" dropdown and their editors render and save correctly (add/remove/reorder items).

- [ ] **Step 6: Screenshot the five public pages and the admin block editor for the owner**

Take screenshots via the Browser pane's `computer` tool (`action: "screenshot"`) of each of the five pages plus the admin editor showing a `feature_grid` block open, and send them to the owner.
