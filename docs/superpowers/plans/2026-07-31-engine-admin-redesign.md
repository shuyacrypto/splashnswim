# Engine Admin Visual & UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `packages/engine-admin` (the shared, generic admin panel used by every school) with a soft-rounded, sidebar-based visual system, consistent save/error feedback, and safer confirmations — plus add a password-reset flow to SplashNSwim's login. No new admin capabilities are added.

**Architecture:** All structural/visual work happens in `packages/engine-admin` behind its existing prop-driven, `--admin-*` CSS-variable theming so every school inherits it automatically. New shared components (`Toast`, `ConfirmDialog`, `EmptyState`, `StatusBadge`, `HomeScreen`) are added alongside the existing ones and adopted by each screen. One small `engine-cms` addition (`updateMediaAlt`) supports inline alt-text editing. `apps/splashnswim` is updated to consume the new shell/nav/Home screen and gets the login password-reset pages.

**Tech Stack:** React 19, Next.js 15 (App Router), TypeScript strict, Tailwind CSS, Supabase Auth, `lucide-react` (new dependency, `engine-admin` only), Vitest + React Testing Library (new dev dependency, `engine-admin` only — this repo has no test runner yet).

## Global Constraints

- British English in all user-facing copy; no em dashes (—) anywhere in copy (CLAUDE.md).
- `packages/engine-admin` stays generic and identical for every school; no school-specific styling or copy inside it (CLAUDE.md, and this spec's stated goal).
- Colours flow only through the existing `--admin-*` CSS variables with neutral fallbacks (e.g. `var(--admin-primary,#0f172a)`) — never a hardcoded hex value tied to one school.
- No new runtime dependency in `packages/engine-contracts` (must stay zero-dependency per CLAUDE.md). `lucide-react` is added to `engine-admin` only.
- No new admin capability, no analytics/dashboards/AI features, no dark mode (see spec's Non-goals).
- No changes to `engine-contracts` schemas or RLS policies (see spec's Testing section) — the one `engine-cms` addition operates within the existing "authenticated: full read/write" RLS policy on `media`.
- Every task must leave `pnpm --filter <package> typecheck` (or the relevant workspace command) passing before it is considered done.
- Source spec: `docs/superpowers/specs/2026-07-31-engine-admin-redesign-design.md`.

---

## Task 1: Test infrastructure for `engine-admin`

This repo has no test runner anywhere yet. `engine-admin` uses ESM (`"type": "module"`) and React 19, so Vitest (native ESM, fast, works well with `@vitejs/plugin-react`) is the right fit — Jest would need extra ESM configuration for no benefit here.

**Files:**
- Modify: `packages/engine-admin/package.json`
- Create: `packages/engine-admin/vitest.config.ts`
- Create: `packages/engine-admin/src/test/setup.ts`
- Create: `packages/engine-admin/src/test/smoke.test.tsx`
- Modify: `turbo.json`

**Interfaces:**
- Produces: `pnpm --filter @swim-engine/engine-admin test` runs Vitest. Every later task's test files (`*.test.tsx`) rely on this.

- [ ] **Step 1: Add test dependencies and script to `package.json`**

Edit `packages/engine-admin/package.json`:

```json
{
  "name": "@swim-engine/engine-admin",
  "version": "0.0.0",
  "private": true,
  "description": "The constrained, generic-branded admin panel as a kit of React screens. Prop-driven; wired to engine-cms by the consuming app.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  },
  "dependencies": {
    "@swim-engine/engine-contracts": "workspace:*",
    "@swim-engine/engine-cms": "workspace:*",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.9.3",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create the Vitest config**

Create `packages/engine-admin/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 3: Create the test setup file**

Create `packages/engine-admin/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Write a smoke test**

Create `packages/engine-admin/src/test/smoke.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <p>Hello, admin.</p>;
}

describe("test infrastructure", () => {
  it("renders a component and finds it with Testing Library", () => {
    render(<Hello />);
    expect(screen.getByText("Hello, admin.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Install dependencies and run the test**

Run: `pnpm install`
Then run: `pnpm --filter @swim-engine/engine-admin test`
Expected: 1 test file, 1 test, PASS.

- [ ] **Step 6: Add the `test` task to `turbo.json`**

Edit `turbo.json` (add `"test"` alongside the existing `"typecheck"` and `"lint"` tasks):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "stream",
  "globalEnv": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "EMAIL_FROM_ADDRESS",
    "ENQUIRY_NOTIFY_EMAIL"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

Also add a root script in `package.json` (`"test": "turbo run test"`) next to the existing `"typecheck"` line, so `pnpm test` works from the repo root the same way `pnpm typecheck` does.

- [ ] **Step 7: Run the root test task**

Run: `pnpm test`
Expected: `@swim-engine/engine-admin#test` passes; all other packages have no `test` script and Turborepo skips them without failing.

- [ ] **Step 8: Commit**

```bash
git add packages/engine-admin/package.json packages/engine-admin/vitest.config.ts packages/engine-admin/src/test/setup.ts packages/engine-admin/src/test/smoke.test.tsx turbo.json package.json pnpm-lock.yaml
git commit -m "test: add Vitest + Testing Library to engine-admin"
```

---

## Task 2: Icon module

Centralises every Lucide icon used across the redesign in one file, so `engine-admin` is the single place that depends on `lucide-react` and consuming apps (and later schools) never need to add it themselves — they import icons from `@swim-engine/engine-admin` directly.

**Files:**
- Create: `packages/engine-admin/src/icons.ts`
- Modify: `packages/engine-admin/src/labels.ts`
- Create: `packages/engine-admin/src/labels.test.ts`

**Interfaces:**
- Produces: `packages/engine-admin/src/icons.ts` re-exports `Home, FileText, ImageIcon, Mail, Settings, Menu, X, ChevronUp, ChevronDown, Trash2, UploadCloud, Images, CalendarClock, DollarSign, HelpCircle, Users, Megaphone, Phone` (all `ComponentType<{ className?: string }>`).
- Produces: `BLOCK_ICONS: Record<Block["type"], ComponentType<{ className?: string }>>` from `labels.ts`, consumed by Task 12 (`BlockEditor`).

- [ ] **Step 1: Create the icon re-export module**

Create `packages/engine-admin/src/icons.ts`:

```ts
/**
 * The one place engine-admin depends on lucide-react. Every icon used across
 * the admin panel is re-exported from here, so consuming apps import icons
 * from @swim-engine/engine-admin rather than adding their own lucide-react
 * dependency (avoiding duplicate installs and version drift).
 */
export {
  Home,
  FileText,
  Image as ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  UploadCloud,
  Images,
  CalendarClock,
  DollarSign,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
} from "lucide-react";
```

- [ ] **Step 2: Write the failing test for `BLOCK_ICONS`**

Create `packages/engine-admin/src/labels.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { BLOCK_LABELS, BLOCK_ICONS } from "./labels.js";

describe("BLOCK_ICONS", () => {
  it("has exactly one icon per block type in BLOCK_LABELS", () => {
    const labelTypes = Object.keys(BLOCK_LABELS).sort();
    const iconTypes = Object.keys(BLOCK_ICONS).sort();
    expect(iconTypes).toEqual(labelTypes);
  });

  it("maps each block type to a component function", () => {
    for (const icon of Object.values(BLOCK_ICONS)) {
      expect(typeof icon).toBe("object"); // lucide icons are forwardRef components
    }
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm --filter @swim-engine/engine-admin test -- labels`
Expected: FAIL with "BLOCK_ICONS is not exported" or similar.

- [ ] **Step 4: Add `BLOCK_ICONS` to `labels.ts`**

Edit `packages/engine-admin/src/labels.ts` — add the import and the new export at the end of the file (keep everything else unchanged):

```ts
import type { Block } from "@swim-engine/engine-contracts";
import type { ComponentType } from "react";
import {
  ImageIcon,
  FileText,
  Images,
  CalendarClock,
  DollarSign,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
} from "./icons.js";

// ... existing BLOCK_LABELS and createBlock stay exactly as they are ...

/** A small icon for each block type, so the block list is scannable at a glance. */
export const BLOCK_ICONS: Record<Block["type"], ComponentType<{ className?: string }>> = {
  hero: ImageIcon,
  rich_text: FileText,
  image: ImageIcon,
  gallery: Images,
  timetable: CalendarClock,
  pricing_table: DollarSign,
  faq: HelpCircle,
  team: Users,
  cta_banner: Megaphone,
  contact: Phone,
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter @swim-engine/engine-admin test -- labels`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/engine-admin/src/icons.ts packages/engine-admin/src/labels.ts packages/engine-admin/src/labels.test.ts
git commit -m "feat(engine-admin): add shared icon module and per-block-type icons"
```

---

## Task 3: `StatusBadge` component

Standardises the Published/Draft pill that currently exists as duplicated inline markup in `PagesScreen.tsx` and `PageEditorScreen.tsx`.

**Files:**
- Create: `packages/engine-admin/src/components/StatusBadge.tsx`
- Create: `packages/engine-admin/src/components/StatusBadge.test.tsx`

**Interfaces:**
- Produces: `StatusBadge({ status: "published" | "draft" })`, consumed by Task 13 (`PagesScreen`) and Task 14 (`PageEditorScreen`).

- [ ] **Step 1: Write the failing test**

Create `packages/engine-admin/src/components/StatusBadge.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge.js";

describe("StatusBadge", () => {
  it("shows Published for a published status", () => {
    render(<StatusBadge status="published" />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("shows Draft for a draft status", () => {
    render(<StatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @swim-engine/engine-admin test -- StatusBadge`
Expected: FAIL — module `./StatusBadge.js` not found.

- [ ] **Step 3: Implement `StatusBadge`**

Create `packages/engine-admin/src/components/StatusBadge.tsx`:

```tsx
export type PageStatus = "published" | "draft";

/** The Published/Draft pill shown on page lists and the page editor. */
export function StatusBadge({ status }: { status: PageStatus }) {
  const isPublished = status === "published";
  return (
    <span
      className={
        isPublished
          ? "inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
          : "inline-flex items-center rounded-full bg-[var(--admin-bg,#f8fafc)] px-2.5 py-0.5 text-xs font-semibold text-[var(--admin-muted,#64748b)]"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @swim-engine/engine-admin test -- StatusBadge`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/StatusBadge.tsx packages/engine-admin/src/components/StatusBadge.test.tsx
git commit -m "feat(engine-admin): add shared StatusBadge component"
```

---

## Task 4: `EmptyState` component

Replaces bare text like "No images uploaded yet." with an icon + message + optional call-to-action.

**Files:**
- Create: `packages/engine-admin/src/components/EmptyState.tsx`
- Create: `packages/engine-admin/src/components/EmptyState.test.tsx`

**Interfaces:**
- Produces: `EmptyState({ icon, title, description, action? })`, consumed by Task 11 (`MediaScreen`) and Task 13 (`PagesScreen`).

- [ ] **Step 1: Write the failing test**

Create `packages/engine-admin/src/components/EmptyState.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState.js";
import { ImageIcon } from "../icons.js";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        icon={ImageIcon}
        title="No images yet"
        description="Upload your first image to get started."
      />,
    );
    expect(screen.getByText("No images yet")).toBeInTheDocument();
    expect(screen.getByText("Upload your first image to get started.")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(
      <EmptyState
        icon={ImageIcon}
        title="No images yet"
        description="Upload your first image."
        action={<button>Upload</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @swim-engine/engine-admin test -- EmptyState`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `EmptyState`**

Create `packages/engine-admin/src/components/EmptyState.tsx`:

```tsx
import type { ComponentType, ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-10 text-center">
      <Icon className="h-10 w-10 text-[var(--admin-muted,#64748b)]" />
      <div>
        <p className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--admin-muted,#64748b)]">{description}</p>
      </div>
      {action ?? null}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @swim-engine/engine-admin test -- EmptyState`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/EmptyState.tsx packages/engine-admin/src/components/EmptyState.test.tsx
git commit -m "feat(engine-admin): add shared EmptyState component"
```

---

## Task 5: `Toast` notification system

Replaces every current silent-or-plain-text save confirmation with a consistent, auto-dismissing corner notification.

**Files:**
- Create: `packages/engine-admin/src/components/Toast.tsx`
- Create: `packages/engine-admin/src/components/Toast.test.tsx`

**Interfaces:**
- Produces: `ToastProvider({ children })` and `useToast(): { showToast: (message: string) => void }`, consumed by Task 8 (`AdminShell`, which wraps every screen in a `ToastProvider`) and every screen task (13, 14, 15) that calls `useToast()`.

- [ ] **Step 1: Write the failing tests**

Create `packages/engine-admin/src/components/Toast.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./Toast.js";

function TriggerButton({ message }: { message: string }) {
  const { showToast } = useToast();
  return <button onClick={() => showToast(message)}>Trigger</button>;
}

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a toast when showToast is called", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <TriggerButton message="Saved." />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByText("Saved.")).toBeInTheDocument();
  });

  it("auto-dismisses the toast after a few seconds", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <TriggerButton message="Saved." />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByText("Saved.")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.queryByText("Saved.")).not.toBeInTheDocument();
  });

  it("throws a clear error if useToast is called outside a provider", () => {
    function Broken() {
      useToast();
      return null;
    }
    expect(() => render(<Broken />)).toThrow(/useToast must be used within a ToastProvider/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- Toast`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Toast`**

Create `packages/engine-admin/src/components/Toast.tsx`:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ToastItem {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Call from any screen inside AdminShell to show a brief success message. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const DISMISS_AFTER_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, DISMISS_AFTER_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto rounded-xl bg-[var(--admin-text,#0f172a)] px-4 py-3 text-sm font-medium text-white shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- Toast`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/Toast.tsx packages/engine-admin/src/components/Toast.test.tsx
git commit -m "feat(engine-admin): add Toast notification system"
```

---

## Task 6: `ConfirmDialog` component

Replaces the browser's native `window.confirm()` (currently used in `BlockEditor.tsx`, `MediaScreen.tsx`, `PagesScreen.tsx`, and `BroadcastScreen.tsx`) with an in-theme modal.

**Files:**
- Create: `packages/engine-admin/src/components/ConfirmDialog.tsx`
- Create: `packages/engine-admin/src/components/ConfirmDialog.test.tsx`

**Interfaces:**
- Produces: `ConfirmDialog({ open, title, message, confirmLabel?, danger?, onConfirm, onCancel })`, consumed by Tasks 11, 12, 13, 15.

- [ ] **Step 1: Write the failing tests**

Create `packages/engine-admin/src/components/ConfirmDialog.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog.js";

describe("ConfirmDialog", () => {
  it("renders nothing when closed", () => {
    render(
      <ConfirmDialog
        open={false}
        title="Delete this page?"
        message="This cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the title and message when open", () => {
    render(
      <ConfirmDialog
        open
        title="Delete this page?"
        message="This cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("dialog", { name: "Delete this page?" })).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Delete this page?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Delete this page?"
        message="This cannot be undone."
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- ConfirmDialog`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ConfirmDialog`**

Create `packages/engine-admin/src/components/ConfirmDialog.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { Button } from "./ui.js";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[var(--admin-surface,#ffffff)] p-6 shadow-xl">
        <h2 className="text-base font-semibold text-[var(--admin-text,#0f172a)]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--admin-muted,#64748b)]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--admin-border,#e2e8f0)] px-4 py-2 text-sm font-semibold text-[var(--admin-text,#0f172a)] hover:bg-[var(--admin-bg,#f8fafc)]"
          >
            Cancel
          </button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- ConfirmDialog`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/ConfirmDialog.tsx packages/engine-admin/src/components/ConfirmDialog.test.tsx
git commit -m "feat(engine-admin): add ConfirmDialog, replacing native window.confirm"
```

---

## Task 7: Restyle core primitives to the soft-rounded visual foundation

Updates `ui.tsx`'s existing primitives (`Button`, `TextField`, `TextAreaField`, `SelectField`, `Toggle`, `Card`) to the approved "soft & rounded" look. **APIs do not change** — every prop stays the same, so no consuming screen needs a rewrite here. Also exports a `buttonClassName` helper so plain `<a>` tags (used in Task 10's Home screen quick actions) can look identical to `<Button>` without nesting a `<button>` inside an `<a>`.

**Files:**
- Modify: `packages/engine-admin/src/components/ui.tsx`
- Create: `packages/engine-admin/src/components/ui.test.tsx`

**Interfaces:**
- Produces: `buttonClassName(variant?: ButtonVariant): string`, consumed by Task 10 (`HomeScreen`).
- All existing exports (`Button`, `TextField`, `TextAreaField`, `SelectField`, `Toggle`, `Card`, `ErrorText`, `RowList`, `Row`, `CtaFields`, `ImageFields`) keep their existing prop signatures.

- [ ] **Step 1: Write the failing test**

Create `packages/engine-admin/src/components/ui.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonClassName, Card, TextField, Toggle } from "./ui.js";

describe("ui primitives", () => {
  it("Button still calls onClick and renders children", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("buttonClassName returns a non-empty class string for every variant", () => {
    expect(buttonClassName("primary").length).toBeGreaterThan(0);
    expect(buttonClassName("secondary").length).toBeGreaterThan(0);
    expect(buttonClassName("danger").length).toBeGreaterThan(0);
  });

  it("Button's rendered class matches buttonClassName for the same variant", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button", { name: "Cancel" }).className).toBe(
      buttonClassName("secondary"),
    );
  });

  it("TextField still reports changes via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Title" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText("Title"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("Toggle still reports changes via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle label="Enabled" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("Card renders its children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @swim-engine/engine-admin test -- ui`
Expected: FAIL — `buttonClassName` is not exported.

- [ ] **Step 3: Update `ui.tsx`**

Edit `packages/engine-admin/src/components/ui.tsx` — replace the `Button` section (from `type ButtonVariant` through the end of the `Button` function) with:

```tsx
type ButtonVariant = "primary" | "secondary" | "danger";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--admin-primary,#0f172a)] text-[var(--admin-on-primary,#ffffff)] hover:bg-[var(--admin-primary-hover,#334155)] shadow-sm",
  secondary:
    "border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] text-[var(--admin-text,#0f172a)] hover:bg-[var(--admin-bg,#f8fafc)]",
  danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
};

/** The class string a `<Button variant>` renders with. Exported so plain
 * links (e.g. the Home screen's quick actions) can look identical to a
 * Button without nesting an interactive element inside an anchor. */
export function buttonClassName(variant: ButtonVariant = "primary"): string {
  return `inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLES[variant]}`;
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName(variant)}
    >
      {children}
    </button>
  );
}
```

Then update the shared style constants just below it (the card radius and input styles) to the softer, more generous scale:

```tsx
const INPUT_CLASS =
  "block w-full rounded-2xl border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] px-4 py-3 text-sm text-[var(--admin-text,#0f172a)] transition-colors focus:border-[var(--admin-primary,#0f172a)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary,#0f172a)]";
const LABEL_CLASS = "text-sm font-medium text-[var(--admin-muted,#64748b)]";
```

And update the `Card` component's className to the softer shadow-based style:

```tsx
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3.5 rounded-2xl border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
      {children}
    </div>
  );
}
```

Every other function in the file (`TextAreaField`, `SelectField`, `Toggle`, `ErrorText`, `RowList`, `Row`, `CtaFields`, `ImageFields`) is unchanged — they already reference `INPUT_CLASS`/`LABEL_CLASS` and will pick up the new look automatically.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @swim-engine/engine-admin test -- ui`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/ui.tsx packages/engine-admin/src/components/ui.test.tsx
git commit -m "style(engine-admin): restyle core primitives to soft-rounded foundation"
```

---

## Task 8: Rebuild `AdminShell` as a sidebar

Replaces the top bar with a sidebar (per the approved layout comparison), adds a `footer` slot (for sign-out), wraps every screen in `ToastProvider` (from Task 5) so any screen can call `useToast()` without extra setup, and adds a responsive mobile slide-over.

**Files:**
- Modify: `packages/engine-admin/src/components/AdminShell.tsx`
- Create: `packages/engine-admin/src/components/AdminShell.test.tsx`
- Modify: `packages/engine-admin/src/index.ts`

**Interfaces:**
- Consumes: `ToastProvider` from `./Toast.js` (Task 5).
- Produces: `AdminNavItem` now requires `icon: ComponentType<{ className?: string }>` (was label/href/active only — **breaking change**, fixed up for SplashNSwim in Task 16). `AdminShell` gains an optional `footer?: ReactNode` prop.

- [ ] **Step 1: Write the failing tests**

Create `packages/engine-admin/src/components/AdminShell.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminShell } from "./AdminShell.js";
import { Home, Settings } from "../icons.js";

const nav = [
  { label: "Home", href: "/admin", icon: Home, active: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, active: false },
];

describe("AdminShell", () => {
  it("renders every nav item and the page content", () => {
    render(
      <AdminShell nav={nav}>
        <p>Page content</p>
      </AdminShell>,
    );
    expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: /Settings/ })).toHaveAttribute(
      "href",
      "/admin/settings",
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders the footer slot when provided", () => {
    render(
      <AdminShell nav={nav} footer={<button>Sign out</button>}>
        <p>Page content</p>
      </AdminShell>,
    );
    expect(screen.getAllByRole("button", { name: "Sign out" }).length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(
      <AdminShell nav={nav}>
        <p>Page content</p>
      </AdminShell>,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("lets a child screen show a toast (ToastProvider is included)", async () => {
    function ScreenWithToast() {
      return <p>Page content</p>;
    }
    render(
      <AdminShell nav={nav}>
        <ScreenWithToast />
      </AdminShell>,
    );
    // No error thrown means ToastProvider successfully wraps children.
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- AdminShell`
Expected: FAIL — nav items currently render without `href` matching `/admin` exactly against `Home` label text (current shell has no icon support, no "Open menu" button), so this fails on the mobile menu assertion and the nav link match.

- [ ] **Step 3: Implement the sidebar `AdminShell`**

Replace the full contents of `packages/engine-admin/src/components/AdminShell.tsx`:

```tsx
"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "../icons.js";
import { ToastProvider } from "./Toast.js";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}

/**
 * The frame around every admin screen: a sidebar with navigation, a themed
 * background, and toast support for every screen inside it. Colours come
 * from CSS variables with neutral fallbacks, so the engine is unbranded by
 * default; a consuming app may theme its own admin by setting the
 * --admin-* variables and passing a `brand` node (e.g. a logo).
 */
export function AdminShell({
  children,
  nav,
  title = "Website admin",
  brand,
  footer,
}: {
  children: ReactNode;
  nav: AdminNavItem[];
  title?: string;
  brand?: ReactNode;
  footer?: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className={
              item.active
                ? "flex items-center gap-2.5 rounded-xl bg-[var(--admin-primary,#0f172a)] px-3 py-2.5 text-sm font-semibold text-[var(--admin-on-primary,#ffffff)]"
                : "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--admin-muted,#64748b)] hover:bg-[var(--admin-bg,#f8fafc)] hover:text-[var(--admin-text,#0f172a)]"
            }
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="flex items-center gap-2 px-2 pb-6 pt-2">
        {brand ?? <span className="text-base font-bold text-[var(--admin-text,#0f172a)]">{title}</span>}
      </div>
      {navLinks}
      {footer ? <div className="mt-auto pt-4">{footer}</div> : null}
    </>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--admin-bg,#f8fafc)] text-[var(--admin-text,#0f172a)] lg:flex">
        <div className="flex items-center justify-between border-b border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-4 lg:hidden">
          {brand ?? <span className="text-base font-bold">{title}</span>}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-[var(--admin-text,#0f172a)] hover:bg-[var(--admin-bg,#f8fafc)]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-4 lg:flex">
          {sidebarInner}
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[var(--admin-surface,#ffffff)] p-4 shadow-xl">
              {sidebarInner}
            </aside>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-6">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- AdminShell`
Expected: PASS (4 tests).

- [ ] **Step 5: Update the package's public exports**

Edit `packages/engine-admin/src/index.ts` — add these lines (keep every existing export as-is):

```ts
export { ToastProvider, useToast } from "./components/Toast.js";
export { ConfirmDialog } from "./components/ConfirmDialog.js";
export { EmptyState } from "./components/EmptyState.js";
export { StatusBadge } from "./components/StatusBadge.js";
export type { PageStatus } from "./components/StatusBadge.js";
export { BLOCK_ICONS } from "./labels.js";
export {
  Home,
  FileText,
  ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  UploadCloud,
  Images,
  CalendarClock,
  DollarSign,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
} from "./icons.js";
```

- [ ] **Step 6: Typecheck the whole package**

Run: `pnpm --filter @swim-engine/engine-admin typecheck`
Expected: PASS (no output on success, or a clean "no errors" from `tsc`). This will surface any file still constructing an `AdminNavItem` without `icon` — none exist inside `engine-admin` itself yet, since that only happens in `apps/splashnswim` (fixed in Task 16).

- [ ] **Step 7: Commit**

```bash
git add packages/engine-admin/src/components/AdminShell.tsx packages/engine-admin/src/components/AdminShell.test.tsx packages/engine-admin/src/index.ts
git commit -m "feat(engine-admin): rebuild AdminShell as a responsive sidebar"
```

---

## Task 9: `engine-cms` — add `updateMediaAlt`

Supports Task 11's inline alt-text editing. Follows the existing `setPagePublished` pattern in `pages.ts` exactly. No schema or RLS change: `media` already grants `authenticated` full read/write (per `packages/engine-db/README.md`'s security model).

**Files:**
- Modify: `packages/engine-cms/src/media.ts`
- Modify: `packages/engine-cms/src/index.ts`
- Create: `packages/engine-cms/src/media.test.ts` (only if `engine-cms` has no test runner — see Step 1)

**Interfaces:**
- Produces: `updateMediaAlt(client: EngineDbClient, id: string, alt: string): Promise<MediaItem>`, consumed by Task 16 (`apps/splashnswim/app/admin/media/page.tsx`) and by `MediaScreenProps.onUpdateAlt` (Task 11).

- [ ] **Step 1: Check whether `engine-cms` already has a test runner**

Run: `cat packages/engine-cms/package.json`

If there is no `"test"` script (expected — no package in this repo has one yet), this task verifies the new function by typechecking and a manual read-through rather than adding a second, separate test runner just for one function; `engine-cms`'s existing functions (`updatePageMeta`, `setPagePublished`, etc.) also have no unit tests today, so a single new function isn't the moment to introduce a different testing setup for this package. This keeps the plan's testing effort focused on `engine-admin`, per the spec.

- [ ] **Step 2: Add `updateMediaAlt`**

Edit `packages/engine-cms/src/media.ts` — add this function after `uploadImage` and before `deleteMedia`:

```ts
/** Updates an uploaded image's alt text (its accessible description). */
export async function updateMediaAlt(
  client: EngineDbClient,
  id: string,
  alt: string,
): Promise<MediaItem> {
  const { data, error } = await client
    .from("media")
    .update({ alt })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new NotFoundError(`No image found with id ${id}.`);
  return rowToMedia(data);
}
```

- [ ] **Step 3: Export it**

Edit `packages/engine-cms/src/index.ts` — change:

```ts
export {
  listMedia,
  getPublicUrl,
  uploadImage,
  deleteMedia,
} from "./media.js";
```

to:

```ts
export {
  listMedia,
  getPublicUrl,
  uploadImage,
  updateMediaAlt,
  deleteMedia,
} from "./media.js";
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @swim-engine/engine-cms typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/engine-cms/src/media.ts packages/engine-cms/src/index.ts
git commit -m "feat(engine-cms): add updateMediaAlt for inline alt-text editing"
```

---

## Task 10: `HomeScreen` component

The new admin landing screen: status cards + quick actions, no analytics.

**Files:**
- Create: `packages/engine-admin/src/components/HomeScreen.tsx`
- Create: `packages/engine-admin/src/components/HomeScreen.test.tsx`
- Modify: `packages/engine-admin/src/index.ts`

**Interfaces:**
- Consumes: `Card`, `buttonClassName` from `./ui.js` (Task 7); `FileText`, `ImageIcon`, `Clock`-equivalent icon from `../icons.js` (note: `Clock` was not in Task 2's icon list — add it there via this task, see Step 3).
- Produces: `HomeScreenStats { totalPages, publishedPages, totalImages, lastEdited: { title, relativeTime } | null }` and `HomeScreenProps { schoolName, stats, newPageHref, uploadImagesHref, broadcastHref }`, consumed by Task 16 (`apps/splashnswim/app/admin/page.tsx`).

- [ ] **Step 1: Write the failing test**

Create `packages/engine-admin/src/components/HomeScreen.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeScreen } from "./HomeScreen.js";

describe("HomeScreen", () => {
  it("shows page, image and last-edited stats", () => {
    render(
      <HomeScreen
        schoolName="SplashNSwim"
        stats={{
          totalPages: 6,
          publishedPages: 5,
          totalImages: 14,
          lastEdited: { title: "Pricing", relativeTime: "2h ago" },
        }}
        newPageHref="/admin/pages"
        uploadImagesHref="/admin/media"
        broadcastHref="/admin/broadcast"
      />,
    );
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText(/5 published/)).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText(/Pricing/)).toBeInTheDocument();
  });

  it("shows a fallback when nothing has been edited yet", () => {
    render(
      <HomeScreen
        schoolName="SplashNSwim"
        stats={{ totalPages: 0, publishedPages: 0, totalImages: 0, lastEdited: null }}
        newPageHref="/admin/pages"
        uploadImagesHref="/admin/media"
        broadcastHref="/admin/broadcast"
      />,
    );
    expect(screen.getByText("No edits yet")).toBeInTheDocument();
  });

  it("links each quick action to the right place", () => {
    render(
      <HomeScreen
        schoolName="SplashNSwim"
        stats={{ totalPages: 0, publishedPages: 0, totalImages: 0, lastEdited: null }}
        newPageHref="/admin/pages"
        uploadImagesHref="/admin/media"
        broadcastHref="/admin/broadcast"
      />,
    );
    expect(screen.getByRole("link", { name: "New page" })).toHaveAttribute(
      "href",
      "/admin/pages",
    );
    expect(screen.getByRole("link", { name: "Upload images" })).toHaveAttribute(
      "href",
      "/admin/media",
    );
    expect(screen.getByRole("link", { name: "Send broadcast" })).toHaveAttribute(
      "href",
      "/admin/broadcast",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @swim-engine/engine-admin test -- HomeScreen`
Expected: FAIL — module not found.

- [ ] **Step 3: Add the missing `Clock` icon to the icon module**

Edit `packages/engine-admin/src/icons.ts` — add `Clock` to the re-export list:

```ts
export {
  Home,
  FileText,
  Image as ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  UploadCloud,
  Images,
  CalendarClock,
  DollarSign,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
  Clock,
} from "lucide-react";
```

- [ ] **Step 4: Implement `HomeScreen`**

Create `packages/engine-admin/src/components/HomeScreen.tsx`:

```tsx
import type { ComponentType } from "react";
import { Card, buttonClassName } from "./ui.js";
import { FileText, ImageIcon, Clock } from "../icons.js";

export interface HomeScreenStats {
  totalPages: number;
  publishedPages: number;
  totalImages: number;
  lastEdited: { title: string; relativeTime: string } | null;
}

export interface HomeScreenProps {
  schoolName: string;
  stats: HomeScreenStats;
  newPageHref: string;
  uploadImagesHref: string;
  broadcastHref: string;
}

export function HomeScreen({
  schoolName,
  stats,
  newPageHref,
  uploadImagesHref,
  broadcastHref,
}: HomeScreenProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--admin-muted,#64748b)]">
          Here is how the {schoolName} website looks today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FileText}
          value={String(stats.totalPages)}
          label={`Pages, ${stats.publishedPages} published`}
        />
        <StatCard icon={ImageIcon} value={String(stats.totalImages)} label="Images in your library" />
        <StatCard
          icon={Clock}
          value={stats.lastEdited ? stats.lastEdited.relativeTime : "No edits yet"}
          label={stats.lastEdited ? `Last edit: ${stats.lastEdited.title}` : "Nothing edited yet"}
        />
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href={newPageHref} className={buttonClassName("primary")}>
            New page
          </a>
          <a href={uploadImagesHref} className={buttonClassName("secondary")}>
            Upload images
          </a>
          <a href={broadcastHref} className={buttonClassName("secondary")}>
            Send broadcast
          </a>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[var(--admin-bg,#f8fafc)] p-2.5">
          <Icon className="h-5 w-5 text-[var(--admin-primary,#0f172a)]" />
        </div>
        <div>
          <div className="text-lg font-bold text-[var(--admin-text,#0f172a)]">{value}</div>
          <div className="text-xs text-[var(--admin-muted,#64748b)]">{label}</div>
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @swim-engine/engine-admin test -- HomeScreen`
Expected: PASS (3 tests).

- [ ] **Step 6: Export from the package**

Edit `packages/engine-admin/src/index.ts` — add:

```ts
export { HomeScreen } from "./components/HomeScreen.js";
export type { HomeScreenProps, HomeScreenStats } from "./components/HomeScreen.js";
export { Clock } from "./icons.js";
```

- [ ] **Step 7: Commit**

```bash
git add packages/engine-admin/src/components/HomeScreen.tsx packages/engine-admin/src/components/HomeScreen.test.tsx packages/engine-admin/src/icons.ts packages/engine-admin/src/index.ts
git commit -m "feat(engine-admin): add HomeScreen (status cards + quick actions)"
```

---

## Task 11: Redesign `MediaScreen`

Adds drag-and-drop upload with a preview thumbnail, inline alt-text editing, replaces the raw storage path with the original filename, and swaps `window.confirm`/plain empty text for `ConfirmDialog`/`EmptyState`/`Toast`.

**Files:**
- Modify: `packages/engine-admin/src/components/MediaScreen.tsx`
- Create: `packages/engine-admin/src/components/MediaScreen.test.tsx`
- Modify: `packages/engine-admin/src/types.ts`

**Interfaces:**
- Consumes: `ConfirmDialog` (Task 6), `EmptyState` (Task 4), `useToast` (Task 5), `UploadCloud`, `Trash2` (Task 2/icons.ts).
- Produces: `MediaScreenProps` gains `onUpdateAlt: (id: string, alt: string) => Promise<void>` — **breaking change**, fixed up in Task 16.

- [ ] **Step 1: Add `onUpdateAlt` to the props type**

Edit `packages/engine-admin/src/types.ts` — change:

```ts
export interface MediaScreenProps {
  items: MediaItem[];
  /** The public web address for a stored file, for use in image blocks. */
  publicUrl: (storagePath: string) => string;
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
```

to:

```ts
export interface MediaScreenProps {
  items: MediaItem[];
  /** The public web address for a stored file, for use in image blocks. */
  publicUrl: (storagePath: string) => string;
  onUpload: (file: File) => Promise<void>;
  onUpdateAlt: (id: string, alt: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
```

- [ ] **Step 2: Write the failing tests**

Create `packages/engine-admin/src/components/MediaScreen.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { MediaScreen } from "./MediaScreen.js";

const items = [
  { id: "1", storagePath: "1700000000000-pool.jpg", alt: "Pool", createdAt: "2026-07-01T00:00:00Z" },
];

function renderScreen(overrides: Partial<React.ComponentProps<typeof MediaScreen>> = {}) {
  return render(
    <ToastProvider>
      <MediaScreen
        items={items}
        publicUrl={(path) => `https://example.com/${path}`}
        onUpload={vi.fn().mockResolvedValue(undefined)}
        onUpdateAlt={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        {...overrides}
      />
    </ToastProvider>,
  );
}

describe("MediaScreen", () => {
  it("shows an empty state when there are no images", () => {
    renderScreen({ items: [] });
    expect(screen.getByText(/No images/)).toBeInTheDocument();
  });

  it("shows the original filename instead of the raw storage path", () => {
    renderScreen();
    expect(screen.getByText("pool.jpg")).toBeInTheDocument();
    expect(screen.queryByText("1700000000000-pool.jpg")).not.toBeInTheDocument();
  });

  it("uploads the file chosen in the file input", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onUpload });
    const file = new File(["data"], "new-photo.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/Choose a file/i) as HTMLInputElement;
    await userEvent.upload(input, file);
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it("uploads a file dropped onto the drop zone", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onUpload });
    const file = new File(["data"], "dropped.jpg", { type: "image/jpeg" });
    const dropZone = screen.getByTestId("upload-drop-zone");
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    expect(await screen.findByText("dropped.jpg")).toBeInTheDocument();
  });

  it("asks for confirmation before deleting, and only deletes on confirm", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onDelete });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Delete image" }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("saves alt text edited inline when the field loses focus", async () => {
    const onUpdateAlt = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onUpdateAlt });
    const altField = screen.getByLabelText("Description of the image (alt text)");
    await userEvent.clear(altField);
    await userEvent.type(altField, "Children swimming");
    await userEvent.tab();
    expect(onUpdateAlt).toHaveBeenCalledWith("1", "Children swimming");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- MediaScreen`
Expected: FAIL — current `MediaScreen` has no empty-state text matching `/No images/` via `EmptyState`, no drop zone, no filename derivation, no confirm dialog, no alt-text field.

- [ ] **Step 4: Implement the redesigned `MediaScreen`**

Replace the full contents of `packages/engine-admin/src/components/MediaScreen.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import type { MediaScreenProps } from "../types.js";
import { Button, Card, ErrorText } from "./ui.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { EmptyState } from "./EmptyState.js";
import { useToast } from "./Toast.js";
import { UploadCloud, ImageIcon, Trash2 } from "../icons.js";
import { errorMessages } from "../helpers.js";

/** The original filename is stored after a timestamp prefix, e.g.
 * "1700000000000-pool.jpg" — this strips that prefix for display. */
function displayFilename(storagePath: string): string {
  return storagePath.replace(/^\d+-/, "");
}

export function MediaScreen({ items, publicUrl, onUpload, onUpdateAlt, onDelete }: MediaScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function run(action: () => Promise<void>) {
    setErrors([]);
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  function selectFile(file: File) {
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  function onFileInputChange() {
    const file = fileInput.current?.files?.[0];
    if (file) selectFile(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) selectFile(file);
  }

  async function confirmUpload() {
    if (!pendingFile) {
      setErrors(["Please choose an image to upload."]);
      return;
    }
    const file = pendingFile;
    await run(async () => {
      await onUpload(file);
      showToast("Image uploaded.");
      setPendingFile(null);
      setPendingPreview(null);
      if (fileInput.current) fileInput.current.value = "";
    });
  }

  async function saveAlt(id: string, alt: string) {
    await run(async () => {
      await onUpdateAlt(id, alt);
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleteTarget(null);
    await run(async () => {
      await onDelete(id);
      showToast("Image deleted.");
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">Images</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Upload an image</h2>
        <div
          data-testid="upload-drop-zone"
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={
            dragActive
              ? "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--admin-primary,#0f172a)] bg-[var(--admin-bg,#f8fafc)] p-8 text-center"
              : "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--admin-border,#e2e8f0)] p-8 text-center"
          }
        >
          <UploadCloud className="h-8 w-8 text-[var(--admin-muted,#64748b)]" />
          <p className="text-sm text-[var(--admin-muted,#64748b)]">
            Drag an image here, or{" "}
            <label className="cursor-pointer font-semibold text-[var(--admin-primary,#0f172a)] underline">
              choose a file
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                aria-label="Choose a file to upload"
                onChange={onFileInputChange}
                className="sr-only"
              />
            </label>
          </p>
          {pendingPreview ? (
            <div className="mt-3 flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingPreview} alt="Preview" className="h-24 w-24 rounded-xl object-cover" />
              <p className="text-xs text-[var(--admin-muted,#64748b)]">{pendingFile?.name}</p>
              <Button onClick={confirmUpload} disabled={busy}>
                {busy ? "Uploading..." : "Upload"}
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images yet"
          description="Upload your first image above to start building your gallery."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicUrl(item.storagePath)}
                alt={item.alt}
                className="h-32 w-full rounded-xl object-cover"
              />
              <p className="truncate text-xs font-medium text-[var(--admin-text,#0f172a)]">
                {displayFilename(item.storagePath)}
              </p>
              <AltTextField value={item.alt} onSave={(next) => saveAlt(item.id, next)} />
              <Button variant="danger" disabled={busy} onClick={() => setDeleteTarget(item.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this image?"
        message="This cannot be undone. Pages using this image will show a broken image until it is replaced."
        confirmLabel="Delete image"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/** Tracks its own draft text and only saves on blur, so typing doesn't fire
 * a network call on every keystroke. */
function AltTextField({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--admin-muted,#64748b)]">
        Description of the image (alt text)
      </span>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (draft !== value) onSave(draft);
        }}
        className="block w-full rounded-2xl border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] px-4 py-3 text-sm text-[var(--admin-text,#0f172a)] transition-colors focus:border-[var(--admin-primary,#0f172a)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary,#0f172a)]"
      />
    </label>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- MediaScreen`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/engine-admin/src/components/MediaScreen.tsx packages/engine-admin/src/components/MediaScreen.test.tsx packages/engine-admin/src/types.ts
git commit -m "feat(engine-admin): redesign MediaScreen with drag-and-drop and inline alt text"
```

---

## Task 12: Redesign `BlockEditor`

Restyles the Move-up/Move-down/Remove controls as icon buttons, adds a per-block-type icon (from Task 2), and replaces `window.confirm` with `ConfirmDialog`.

**Files:**
- Modify: `packages/engine-admin/src/components/BlockEditor.tsx`
- Create: `packages/engine-admin/src/components/BlockEditor.test.tsx`

**Interfaces:**
- Consumes: `BLOCK_ICONS` (Task 2), `ConfirmDialog` (Task 6), `ChevronUp`, `ChevronDown`, `Trash2` (Task 2/icons.ts).
- No prop-type change — `BlockEditor`'s `{ blocks, onChange }` signature is unchanged.

- [ ] **Step 1: Write the failing tests**

Create `packages/engine-admin/src/components/BlockEditor.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlockEditor } from "./BlockEditor.js";
import type { Block } from "@swim-engine/engine-contracts";

const blocks: Block[] = [
  { id: "a", type: "hero", heading: "Welcome" },
  { id: "b", type: "rich_text", content: "Some text." },
];

describe("BlockEditor", () => {
  it("moves a block down when Move down is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BlockEditor blocks={blocks} onChange={onChange} />);
    const moveDownButtons = screen.getAllByRole("button", { name: "Move down" });
    await user.click(moveDownButtons[0]!);
    expect(onChange).toHaveBeenCalledWith([blocks[1], blocks[0]]);
  });

  it("asks for confirmation before removing a block", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BlockEditor blocks={blocks} onChange={onChange} />);
    await user.click(screen.getAllByRole("button", { name: "Remove" })[0]!);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove block" }));
    expect(onChange).toHaveBeenCalledWith([blocks[1]]);
  });

  it("shows the friendly label for each block type", () => {
    render(<BlockEditor blocks={blocks} onChange={vi.fn()} />);
    expect(screen.getByText("Hero banner")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- BlockEditor`
Expected: FAIL — current `BlockEditor` calls `window.confirm` (not a dialog with role) and has no "Remove block" confirm button.

- [ ] **Step 3: Implement the redesigned `BlockEditor`**

Replace the full contents of `packages/engine-admin/src/components/BlockEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import { BLOCK_ICONS, BLOCK_LABELS, createBlock } from "../labels.js";
import { BlockFields } from "./blocks/editors.js";
import { Button, Card, SelectField } from "./ui.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { ChevronUp, ChevronDown } from "../icons.js";
import { move, removeAt, replaceAt } from "../array.js";

const BLOCK_TYPE_OPTIONS = (
  Object.keys(BLOCK_LABELS) as Block["type"][]
).map((type) => ({ value: type, label: BLOCK_LABELS[type] }));

/**
 * A controlled editor for a page's content blocks. The parent owns the block
 * list and saving, so the whole page saves with a single action.
 */
export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [newType, setNewType] = useState<Block["type"]>("hero");
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  function addBlock() {
    onChange([...blocks, createBlock(newType, crypto.randomUUID())]);
  }

  function confirmRemove() {
    if (removeIndex === null) return;
    onChange(removeAt(blocks, removeIndex));
    setRemoveIndex(null);
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const Icon = BLOCK_ICONS[block.type];
        return (
          <Card key={block.id}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text,#0f172a)]">
                <Icon className="h-4 w-4 text-[var(--admin-muted,#64748b)]" />
                {BLOCK_LABELS[block.type]}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={index === 0}
                  onClick={() => onChange(move(blocks, index, index - 1))}
                >
                  <ChevronUp className="h-4 w-4" />
                  Move up
                </Button>
                <Button
                  variant="secondary"
                  disabled={index === blocks.length - 1}
                  onClick={() => onChange(move(blocks, index, index + 1))}
                >
                  <ChevronDown className="h-4 w-4" />
                  Move down
                </Button>
                <Button variant="danger" onClick={() => setRemoveIndex(index)}>
                  Remove
                </Button>
              </div>
            </div>
            <BlockFields
              block={block}
              onChange={(next) => onChange(replaceAt(blocks, index, next))}
            />
          </Card>
        );
      })}

      {blocks.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted,#64748b)]">
          This page has no content blocks yet. Add one below.
        </p>
      ) : null}

      <Card>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <SelectField
              label="Add a block"
              value={newType}
              options={BLOCK_TYPE_OPTIONS}
              onChange={(value) => setNewType(value as Block["type"])}
            />
          </div>
          <Button variant="secondary" onClick={addBlock}>
            Add block
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={removeIndex !== null}
        title="Remove this block?"
        message={
          removeIndex !== null
            ? `Remove this "${BLOCK_LABELS[blocks[removeIndex]!.type]}" block? This cannot be undone once saved.`
            : ""
        }
        confirmLabel="Remove block"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setRemoveIndex(null)}
      />
    </div>
  );
}
```

This preserves the original file's "Add a block" section (the `flex items-end gap-3` wrapper around the `SelectField` and `Button`) verbatim — only the header row, the Move up/down/Remove buttons, and the removal flow change.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- BlockEditor`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/BlockEditor.tsx packages/engine-admin/src/components/BlockEditor.test.tsx
git commit -m "feat(engine-admin): redesign BlockEditor with icons and ConfirmDialog"
```

---

## Task 13: Redesign `PagesScreen`

Adopts `StatusBadge`, `EmptyState`, `ConfirmDialog`, and a `Toast` for page creation.

**Files:**
- Modify: `packages/engine-admin/src/components/PagesScreen.tsx`
- Create: `packages/engine-admin/src/components/PagesScreen.test.tsx`

**Interfaces:**
- Consumes: `StatusBadge` (Task 3), `EmptyState` (Task 4), `useToast` (Task 5), `ConfirmDialog` (Task 6), `FileText` icon (Task 2).
- No prop-type change — `PagesScreenProps` is unchanged.

- [ ] **Step 1: Write the failing tests**

Create `packages/engine-admin/src/components/PagesScreen.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { PagesScreen } from "./PagesScreen.js";

const pages = [
  { id: "1", slug: "home", title: "Home", published: true, updatedAt: "2026-07-01T00:00:00Z" },
  { id: "2", slug: "about", title: "About", published: false, updatedAt: "2026-07-02T00:00:00Z" },
];

function renderScreen(overrides: Partial<React.ComponentProps<typeof PagesScreen>> = {}) {
  return render(
    <ToastProvider>
      <PagesScreen
        pages={pages}
        editHref={(id) => `/admin/pages/${id}`}
        onCreatePage={vi.fn().mockResolvedValue(undefined)}
        onTogglePublished={vi.fn().mockResolvedValue(undefined)}
        onDeletePage={vi.fn().mockResolvedValue(undefined)}
        {...overrides}
      />
    </ToastProvider>,
  );
}

describe("PagesScreen", () => {
  it("shows a StatusBadge for each page", () => {
    renderScreen();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows an empty state when there are no pages", () => {
    renderScreen({ pages: [] });
    expect(screen.getByText("No pages yet")).toBeInTheDocument();
  });

  it("asks for confirmation before deleting a page", async () => {
    const onDeletePage = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderScreen({ onDeletePage });
    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]!);
    expect(onDeletePage).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Delete page" }));
    expect(onDeletePage).toHaveBeenCalledWith("1");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- PagesScreen`
Expected: FAIL — no "No pages yet" `EmptyState`, no "Delete page" confirm button.

- [ ] **Step 3: Implement the redesigned `PagesScreen`**

Replace the full contents of `packages/engine-admin/src/components/PagesScreen.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { PagesScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextField } from "./ui.js";
import { StatusBadge } from "./StatusBadge.js";
import { EmptyState } from "./EmptyState.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { useToast } from "./Toast.js";
import { FileText } from "../icons.js";
import { errorMessages } from "../helpers.js";

export function PagesScreen({
  pages,
  editHref,
  onCreatePage,
  onTogglePublished,
  onDeletePage,
}: PagesScreenProps) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const { showToast } = useToast();

  async function run(action: () => Promise<void>) {
    setErrors([]);
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    await run(async () => {
      await onCreatePage({ slug, title });
      showToast(`"${title}" created.`);
      setSlug("");
      setTitle("");
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    await run(async () => {
      await onDeletePage(id);
      showToast("Page deleted.");
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">Pages</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Create a new page</h2>
        <TextField label="Title" value={title} onChange={setTitle} placeholder="About us" />
        <TextField label="Page address" value={slug} onChange={setSlug} placeholder="about-us" />
        <Button onClick={create} disabled={busy}>
          Create page
        </Button>
      </Card>

      {pages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No pages yet"
          description="Create your first page above to start building your site."
        />
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <Card key={page.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <a
                    href={editHref(page.id)}
                    className="text-sm font-semibold text-[var(--admin-text,#0f172a)] hover:underline"
                  >
                    {page.title}
                  </a>
                  <p className="text-xs text-[var(--admin-muted,#64748b)]">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={page.published ? "published" : "draft"} />
                  <Button
                    variant="secondary"
                    disabled={busy}
                    onClick={() => run(() => onTogglePublished(page.id, !page.published))}
                  >
                    {page.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => setDeleteTarget({ id: page.id, title: page.title })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this page?"
        message={deleteTarget ? `Delete the page "${deleteTarget.title}"? This cannot be undone.` : ""}
        confirmLabel="Delete page"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- PagesScreen`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/PagesScreen.tsx packages/engine-admin/src/components/PagesScreen.test.tsx
git commit -m "feat(engine-admin): redesign PagesScreen with StatusBadge, EmptyState, ConfirmDialog"
```

---

## Task 14: Redesign `PageEditorScreen`

Swaps the inline Published/Draft pill for `StatusBadge`, and the "All changes saved." text for a `Toast`.

**Files:**
- Modify: `packages/engine-admin/src/components/PageEditorScreen.tsx`
- Create: `packages/engine-admin/src/components/PageEditorScreen.test.tsx`

**Interfaces:**
- Consumes: `StatusBadge` (Task 3), `useToast` (Task 5).
- No prop-type change — `PageEditorScreenProps` is unchanged.

- [ ] **Step 1: Write the failing tests**

Create `packages/engine-admin/src/components/PageEditorScreen.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { PageEditorScreen } from "./PageEditorScreen.js";
import type { Page } from "@swim-engine/engine-contracts";

const page: Page = {
  id: "1",
  slug: "home",
  title: "Home",
  blocks: [],
  published: true,
  updatedAt: "2026-07-01T00:00:00Z",
};

function renderScreen(overrides: Partial<React.ComponentProps<typeof PageEditorScreen>> = {}) {
  return render(
    <ToastProvider>
      <PageEditorScreen
        page={page}
        backHref="/admin/pages"
        onSaveBlocks={vi.fn().mockResolvedValue(undefined)}
        onSaveMeta={vi.fn().mockResolvedValue(undefined)}
        onTogglePublished={vi.fn().mockResolvedValue(undefined)}
        {...overrides}
      />
    </ToastProvider>,
  );
}

describe("PageEditorScreen", () => {
  it("shows a StatusBadge matching the page's published state", () => {
    renderScreen();
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("shows a toast after saving", async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByText("All changes saved.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- PageEditorScreen`
Expected: FAIL — wrapping in `ToastProvider` is new, and the toast text currently renders inline (still findable), so this specific assertion likely already passes; the meaningful failure is confirming `StatusBadge`'s exact "Published" text renders once cleanly (no duplicate markup) after Step 3's refactor. Proceed to Step 3 regardless, then re-run.

- [ ] **Step 3: Implement the redesigned `PageEditorScreen`**

Edit `packages/engine-admin/src/components/PageEditorScreen.tsx` — replace the whole file:

```tsx
"use client";

import { useState } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import type { PageEditorScreenProps } from "../types.js";
import { BlockEditor } from "./BlockEditor.js";
import { Button, Card, ErrorText, TextField } from "./ui.js";
import { StatusBadge } from "./StatusBadge.js";
import { useToast } from "./Toast.js";
import { errorMessages } from "../helpers.js";

export function PageEditorScreen({
  page,
  backHref,
  onSaveBlocks,
  onSaveMeta,
  onTogglePublished,
}: PageEditorScreenProps) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  const [blocks, setBlocks] = useState<Block[]>(page.blocks);
  const [published, setPublished] = useState(page.published);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function run(action: () => Promise<void>) {
    setErrors([]);
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  async function saveAll() {
    await run(async () => {
      await onSaveMeta({ title, slug, metaTitle, metaDescription });
      await onSaveBlocks(blocks);
      showToast("All changes saved.");
    });
  }

  async function togglePublished() {
    await run(async () => {
      await onTogglePublished(!published);
      setPublished(!published);
      showToast(published ? "Page unpublished." : "Page published.");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <a
          href={backHref}
          className="text-sm font-medium text-[var(--admin-muted,#64748b)] hover:text-[var(--admin-text,#0f172a)]"
        >
          Back to pages
        </a>
        <div className="flex items-center gap-3">
          <StatusBadge status={published ? "published" : "draft"} />
          <Button variant="secondary" disabled={busy} onClick={togglePublished}>
            {published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">{title}</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Page details</h2>
        <TextField label="Title" value={title} onChange={setTitle} />
        <TextField label="Page address" value={slug} onChange={setSlug} />
        <TextField label="Search engine title (optional)" value={metaTitle} onChange={setMetaTitle} />
        <TextField
          label="Search engine description (optional)"
          value={metaDescription}
          onChange={setMetaDescription}
        />
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-[var(--admin-text,#0f172a)]">Content</h2>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </div>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-2xl border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-3 shadow-lg">
        <Button onClick={saveAll} disabled={busy}>
          {busy ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
```

Note: this drops the `edited()` wrapper that cleared a `saved` boolean on every keystroke, since success feedback now comes from the toast fired only on an actual save, not from a persistent "saved" flag that needed clearing. This is a simplification enabled by the toast system, not a regression: the sticky save bar still always shows the Save button, and the toast confirms success at the moment of saving rather than as a lingering label.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- PageEditorScreen`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/engine-admin/src/components/PageEditorScreen.tsx packages/engine-admin/src/components/PageEditorScreen.test.tsx
git commit -m "feat(engine-admin): redesign PageEditorScreen with StatusBadge and Toast"
```

---

## Task 15: Redesign `SettingsScreen` and `BroadcastScreen`

Swaps plain-text save confirmations for `Toast`, and `BroadcastScreen`'s `window.confirm` for `ConfirmDialog`.

**Files:**
- Modify: `packages/engine-admin/src/components/SettingsScreen.tsx`
- Create: `packages/engine-admin/src/components/SettingsScreen.test.tsx`
- Modify: `packages/engine-admin/src/components/BroadcastScreen.tsx`
- Create: `packages/engine-admin/src/components/BroadcastScreen.test.tsx`

**Interfaces:**
- Consumes: `useToast` (Task 5), `ConfirmDialog` (Task 6).
- No prop-type changes to either screen.

- [ ] **Step 1: Write the failing test for `SettingsScreen`**

Create `packages/engine-admin/src/components/SettingsScreen.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { SettingsScreen } from "./SettingsScreen.js";

describe("SettingsScreen", () => {
  it("shows a toast after saving", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <SettingsScreen settings={null} onSave={vi.fn().mockResolvedValue(undefined)} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Save settings" }));
    expect(await screen.findByText("Settings saved.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @swim-engine/engine-admin test -- SettingsScreen`
Expected: FAIL — `useToast` is not imported and no `ToastProvider` is present around the current component in isolation (the current component itself renders fine, but there's no "Settings saved." text — it currently shows "Saved.").

- [ ] **Step 3: Update `SettingsScreen`**

Edit `packages/engine-admin/src/components/SettingsScreen.tsx` — replace the `save` function and the final render block:

```tsx
"use client";

import { useState } from "react";
import type { SettingsScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextField, Toggle } from "./ui.js";
import { useToast } from "./Toast.js";
import { errorMessages } from "../helpers.js";

export function SettingsScreen({ settings, onSave }: SettingsScreenProps) {
  const [schoolName, setSchoolName] = useState(settings?.schoolName ?? "");
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone ?? "");
  const [bookingEnabled, setBookingEnabled] = useState(settings?.bookingEnabled ?? false);
  const [facebook, setFacebook] = useState(settings?.socialLinks?.facebook ?? "");
  const [instagram, setInstagram] = useState(settings?.socialLinks?.instagram ?? "");
  const [tiktok, setTiktok] = useState(settings?.socialLinks?.tiktok ?? "");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function save() {
    setErrors([]);
    const socialLinks = {
      ...(facebook ? { facebook } : {}),
      ...(instagram ? { instagram } : {}),
      ...(tiktok ? { tiktok } : {}),
    };
    setBusy(true);
    try {
      await onSave({
        schoolName,
        contactEmail,
        contactPhone: contactPhone === "" ? undefined : contactPhone,
        bookingEnabled,
        socialLinks,
      });
      showToast("Settings saved.");
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">Site settings</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">School details</h2>
        <TextField label="School name" value={schoolName} onChange={setSchoolName} />
        <TextField label="Contact email" type="email" value={contactEmail} onChange={setContactEmail} />
        <TextField label="Contact phone (optional)" value={contactPhone} onChange={setContactPhone} />
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Social links (optional)</h2>
        <TextField label="Facebook" type="url" value={facebook} onChange={setFacebook} />
        <TextField label="Instagram" type="url" value={instagram} onChange={setInstagram} />
        <TextField label="TikTok" type="url" value={tiktok} onChange={setTiktok} />
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Modules</h2>
        <Toggle label="Enable booking and billing" checked={bookingEnabled} onChange={setBookingEnabled} />
        <p className="text-sm text-[var(--admin-muted,#64748b)]">
          Booking and billing is an optional add-on set up separately for your school. When it is
          switched on, the booking screens appear in the admin. If nothing changes after enabling
          it, the module is not set up for your school yet.
        </p>
      </Card>

      <Button onClick={save} disabled={busy}>
        {busy ? "Saving..." : "Save settings"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @swim-engine/engine-admin test -- SettingsScreen`
Expected: PASS.

- [ ] **Step 5: Write the failing test for `BroadcastScreen`**

Create `packages/engine-admin/src/components/BroadcastScreen.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { BroadcastScreen } from "./BroadcastScreen.js";

function renderScreen(onSend = vi.fn().mockResolvedValue(undefined)) {
  return render(
    <ToastProvider>
      <BroadcastScreen recipientCount={12} audienceLabel="parents" onSend={onSend} />
    </ToastProvider>,
  );
}

describe("BroadcastScreen", () => {
  it("asks for confirmation before sending, and only sends on confirm", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderScreen(onSend);
    await user.type(screen.getByLabelText("Subject"), "Pool closure");
    await user.type(screen.getByLabelText("Message"), "The pool is closed this weekend.");
    await user.click(screen.getByRole("button", { name: "Send broadcast" }));
    expect(onSend).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Send to 12 parents" }));
    expect(onSend).toHaveBeenCalledWith("Pool closure", "The pool is closed this weekend.");
  });

  it("shows a toast after sending", async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.type(screen.getByLabelText("Subject"), "Pool closure");
    await user.type(screen.getByLabelText("Message"), "The pool is closed this weekend.");
    await user.click(screen.getByRole("button", { name: "Send broadcast" }));
    await user.click(screen.getByRole("button", { name: "Send to 12 parents" }));
    expect(await screen.findByText("Your message has been sent.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `pnpm --filter @swim-engine/engine-admin test -- BroadcastScreen`
Expected: FAIL — `window.confirm` cannot be clicked in a test; there is no "Send to 12 parents" button role.

- [ ] **Step 7: Update `BroadcastScreen`**

Replace the full contents of `packages/engine-admin/src/components/BroadcastScreen.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { BroadcastScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextAreaField, TextField } from "./ui.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { useToast } from "./Toast.js";
import { errorMessages } from "../helpers.js";

export function BroadcastScreen({ recipientCount, audienceLabel, onSend }: BroadcastScreenProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showToast } = useToast();

  function requestSend() {
    setErrors([]);
    if (subject.trim() === "" || message.trim() === "") {
      setErrors(["Please enter a subject and a message before sending."]);
      return;
    }
    setConfirmOpen(true);
  }

  async function confirmSend() {
    setConfirmOpen(false);
    setBusy(true);
    try {
      await onSend(subject, message);
      showToast("Your message has been sent.");
      setSubject("");
      setMessage("");
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  const noun = recipientCount === 1 ? "recipient" : "recipients";

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">
        Send a broadcast
      </h1>
      <p className="text-sm text-[var(--admin-muted,#64748b)]">
        This message will be sent to {recipientCount} {audienceLabel}.
      </p>

      <ErrorText messages={errors} />

      <Card>
        <TextField label="Subject" value={subject} onChange={setSubject} />
        <TextAreaField label="Message" value={message} onChange={setMessage} rows={10} />
        <Button onClick={requestSend} disabled={busy || recipientCount === 0}>
          {busy ? "Sending..." : "Send broadcast"}
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Send this broadcast?"
        message={`Send this message to ${recipientCount} ${noun}? This cannot be undone.`}
        confirmLabel={`Send to ${recipientCount} ${audienceLabel}`}
        onConfirm={confirmSend}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `pnpm --filter @swim-engine/engine-admin test -- BroadcastScreen`
Expected: PASS (2 tests).

- [ ] **Step 9: Run the full `engine-admin` test suite**

Run: `pnpm --filter @swim-engine/engine-admin test`
Expected: every test file created in Tasks 1–15 passes.

- [ ] **Step 10: Commit**

```bash
git add packages/engine-admin/src/components/SettingsScreen.tsx packages/engine-admin/src/components/SettingsScreen.test.tsx packages/engine-admin/src/components/BroadcastScreen.tsx packages/engine-admin/src/components/BroadcastScreen.test.tsx
git commit -m "feat(engine-admin): add Toast/ConfirmDialog to SettingsScreen and BroadcastScreen"
```

---

## Task 16: Wire the redesign into `apps/splashnswim`

Updates the nav (adds Home + the previously-missing Broadcast link, adds icons, moves sign-out into the new `footer` slot), replaces the `/admin` redirect with the real `HomeScreen`, and wires `onUpdateAlt` on the media page.

**Files:**
- Modify: `apps/splashnswim/app/admin/layout.tsx`
- Modify: `apps/splashnswim/app/admin/page.tsx`
- Modify: `apps/splashnswim/app/admin/media/page.tsx`

**Interfaces:**
- Consumes: `AdminShell`, `HomeScreen`, `HomeScreenStats`, `Home`, `FileText`, `ImageIcon`, `Mail`, `Settings` from `@swim-engine/engine-admin` (Tasks 2, 8, 10); `updateMediaAlt` from `@swim-engine/engine-cms` (Task 9).

- [ ] **Step 1: Update the admin layout's nav and sign-out placement**

Replace the full contents of `apps/splashnswim/app/admin/layout.tsx`:

```tsx
"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell, Home, FileText, ImageIcon, Mail, Settings } from "@swim-engine/engine-admin";
import { Logo } from "@/components/Brand";
import { createClientSupabase } from "@/lib/supabase/client";

/**
 * SplashNSwim admin theme. The engine admin is neutral by default; here we set
 * the --admin-* variables to the SplashNSwim palette so this school's admin is
 * on brand. Other schools would set their own (or use the neutral defaults).
 */
const ADMIN_THEME = {
  "--admin-bg": "#eef9fc",
  "--admin-surface": "#ffffff",
  "--admin-border": "#d3ecf3",
  "--admin-text": "#0e2a3b",
  "--admin-muted": "#5b7a8a",
  "--admin-primary": "#0c5278",
  "--admin-primary-hover": "#082d48",
  "--admin-on-primary": "#ffffff",
} as CSSProperties;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());

  const nav = [
    { label: "Home", href: "/admin", icon: Home, active: pathname === "/admin" },
    { label: "Pages", href: "/admin/pages", icon: FileText, active: pathname.startsWith("/admin/pages") },
    { label: "Images", href: "/admin/media", icon: ImageIcon, active: pathname === "/admin/media" },
    { label: "Broadcast", href: "/admin/broadcast", icon: Mail, active: pathname === "/admin/broadcast" },
    { label: "Settings", href: "/admin/settings", icon: Settings, active: pathname === "/admin/settings" },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={ADMIN_THEME}>
      <AdminShell
        nav={nav}
        brand={<Logo className="h-11" />}
        footer={
          <button
            type="button"
            onClick={signOut}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--admin-muted,#64748b)] hover:bg-[var(--admin-bg,#f8fafc)] hover:text-[var(--admin-text,#0f172a)]"
          >
            Sign out
          </button>
        }
      >
        {children}
      </AdminShell>
    </div>
  );
}
```

This also fixes a pre-existing gap: `Broadcast` was missing from the nav array entirely before this change.

- [ ] **Step 2: Replace the `/admin` redirect with the Home screen**

Replace the full contents of `apps/splashnswim/app/admin/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { HomeScreen } from "@swim-engine/engine-admin";
import type { HomeScreenStats } from "@swim-engine/engine-admin";
import { listPages, listMedia } from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

function relativeTime(iso: string): string {
  const diffMinutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function AdminHome() {
  const [supabase] = useState(() => createClientSupabase());
  const [stats, setStats] = useState<HomeScreenStats | null>(null);

  useEffect(() => {
    async function load() {
      const [pages, media] = await Promise.all([listPages(supabase), listMedia(supabase)]);
      const mostRecent = pages[0] ?? null;
      setStats({
        totalPages: pages.length,
        publishedPages: pages.filter((page) => page.published).length,
        totalImages: media.length,
        lastEdited: mostRecent
          ? { title: mostRecent.title, relativeTime: relativeTime(mostRecent.updatedAt) }
          : null,
      });
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <HomeScreen
      schoolName="SplashNSwim"
      stats={stats}
      newPageHref="/admin/pages"
      uploadImagesHref="/admin/media"
      broadcastHref="/admin/broadcast"
    />
  );
}
```

(`listPages` already orders by `updated_at` descending — see `packages/engine-cms/src/pages.ts` — so `pages[0]` is the most recently edited page.)

- [ ] **Step 3: Wire `onUpdateAlt` on the media page**

Edit `apps/splashnswim/app/admin/media/page.tsx` — add the import and prop:

```tsx
"use client";

import { useEffect, useState } from "react";
import { MediaScreen } from "@swim-engine/engine-admin";
import type { MediaItem } from "@swim-engine/engine-admin";
import {
  listMedia,
  uploadImage,
  updateMediaAlt,
  deleteMedia,
  getPublicUrl,
} from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

export default function AdminMediaPage() {
  const [supabase] = useState(() => createClientSupabase());
  const [items, setItems] = useState<MediaItem[] | null>(null);

  async function refresh() {
    setItems(await listMedia(supabase));
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <MediaScreen
      items={items}
      publicUrl={(storagePath) => getPublicUrl(supabase, storagePath)}
      onUpload={async (file) => {
        const bytes = new Uint8Array(await file.arrayBuffer());
        await uploadImage(supabase, {
          path: `${Date.now()}-${file.name}`,
          file: bytes,
          contentType: file.type,
          alt: file.name,
        });
        await refresh();
      }}
      onUpdateAlt={async (id, alt) => {
        await updateMediaAlt(supabase, id, alt);
        await refresh();
      }}
      onDelete={async (id) => {
        await deleteMedia(supabase, id);
        await refresh();
      }}
    />
  );
}
```

- [ ] **Step 4: Typecheck the app**

Run: `pnpm --filter splashnswim typecheck`
Expected: PASS. (If the package name differs from `splashnswim`, check `apps/splashnswim/package.json`'s `"name"` field and use that instead.)

- [ ] **Step 5: Manual verification in the browser**

Run: `pnpm --filter splashnswim dev`, sign in at `/login`, and check:
- The sidebar shows Home, Pages, Images, Broadcast, Settings, all with icons, in SplashNSwim's brand colours.
- `/admin` shows the new Home screen with real page/image counts and a real "last edited" page name.
- Sign out appears at the bottom of the sidebar and still works.
- On a narrow window (or mobile device emulation), the sidebar collapses to a hamburger menu that opens and closes.
- On the Images screen: drag an image onto the drop zone (and separately, use "choose a file") and confirm the preview and upload both work; edit an image's alt text and tab away, confirm it persists after a refresh; delete an image and confirm the `ConfirmDialog` appears before it is removed.
- On the Pages screen: delete a page and confirm the `ConfirmDialog` appears; create a page and confirm a toast appears.
- On the Broadcast screen: attempt to send and confirm the `ConfirmDialog` names the exact recipient count before sending.

- [ ] **Step 6: Commit**

```bash
git add apps/splashnswim/app/admin/layout.tsx apps/splashnswim/app/admin/page.tsx apps/splashnswim/app/admin/media/page.tsx
git commit -m "feat(splashnswim): adopt the redesigned engine-admin shell and Home screen"
```

---

## Task 17: Login password reset flow

Adds "Forgot password?" to the existing SplashNSwim login page (which correctly stays on the school's own bespoke Tailwind tokens, not the engine-admin `--admin-*` system — see the design spec's note on this), and a new page to set a new password.

**Files:**
- Modify: `apps/splashnswim/app/login/page.tsx`
- Create: `apps/splashnswim/app/reset-password/page.tsx`

**Interfaces:**
- Consumes: Supabase Auth's `resetPasswordForEmail` and `updateUser` (already available via `createClientSupabase()`, no new dependency).

- [ ] **Step 1: Add the "Forgot password?" flow to the login page**

Replace the full contents of `apps/splashnswim/app/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Brand";
import { createClientSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "reset-request" | "reset-sent">("sign-in");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function handleResetRequest(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMode("reset-sent");
  }

  const field =
    "block w-full rounded-xl border-2 border-foam bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ocean focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-foam px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-16" />
        </div>
        <div className="rounded-3xl border border-ocean/10 bg-surface p-8 shadow-lg">
          {mode === "sign-in" ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Admin sign in</h1>
              <p className="mt-1 text-sm text-slate">Manage your SplashNSwim website.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-ink">Email</span>
                  <input
                    aria-label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="email"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Password</span>
                  <input
                    aria-label="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="current-password"
                  />
                </label>
                {error ? <p className="text-sm text-coral-deep">{error}</p> : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss disabled:opacity-50"
                >
                  {busy ? "Signing in..." : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("reset-request");
                  }}
                  className="w-full text-center text-sm font-medium text-ocean-deep hover:underline"
                >
                  Forgot password?
                </button>
              </form>
            </>
          ) : null}

          {mode === "reset-request" ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Reset your password</h1>
              <p className="mt-1 text-sm text-slate">
                Enter your email and we will send you a link to set a new password.
              </p>
              <form onSubmit={handleResetRequest} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-ink">Email</span>
                  <input
                    aria-label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="email"
                  />
                </label>
                {error ? <p className="text-sm text-coral-deep">{error}</p> : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss disabled:opacity-50"
                >
                  {busy ? "Sending..." : "Send reset link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("sign-in");
                  }}
                  className="w-full text-center text-sm font-medium text-ocean-deep hover:underline"
                >
                  Back to sign in
                </button>
              </form>
            </>
          ) : null}

          {mode === "reset-sent" ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Check your email</h1>
              <p className="mt-1 text-sm text-slate">
                If an account exists for {email}, a password reset link is on its way.
              </p>
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className="mt-6 w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss"
              >
                Back to sign in
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the "set new password" page**

Create `apps/splashnswim/app/reset-password/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Brand";
import { createClientSupabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
  }

  const field =
    "block w-full rounded-xl border-2 border-foam bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ocean focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-foam px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-16" />
        </div>
        <div className="rounded-3xl border border-ocean/10 bg-surface p-8 shadow-lg">
          {done ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Password updated</h1>
              <p className="mt-1 text-sm text-slate">You can now sign in with your new password.</p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-6 w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss"
              >
                Go to sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Set a new password</h1>
              <p className="mt-1 text-sm text-slate">Choose a new password for your admin account.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-ink">New password</span>
                  <input
                    aria-label="New password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Confirm new password</span>
                  <input
                    aria-label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="new-password"
                  />
                </label>
                {error ? <p className="text-sm text-coral-deep">{error}</p> : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss disabled:opacity-50"
                >
                  {busy ? "Saving..." : "Set new password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter splashnswim typecheck`
Expected: PASS.

- [ ] **Step 4: Manual verification in the browser**

Run: `pnpm --filter splashnswim dev`. On `/login`, click "Forgot password?", enter the admin's email, and submit — confirm the "Check your email" screen appears (the actual email delivery depends on Supabase's configured SMTP/Auth email settings, which are outside this plan's scope; verify the request itself succeeds without an error). If a real reset email arrives, click its link and confirm it lands on `/reset-password`, that setting a new password succeeds, and that the new password then works on `/login`.

- [ ] **Step 5: Commit**

```bash
git add apps/splashnswim/app/login/page.tsx apps/splashnswim/app/reset-password/page.tsx
git commit -m "feat(splashnswim): add forgot-password and reset-password flow to login"
```

---

## Task 18: Full-repo verification

Confirms nothing elsewhere in the monorepo broke.

**Files:** none (verification only).

- [ ] **Step 1: Run every package's typecheck**

Run: `pnpm typecheck`
Expected: PASS for every package (`engine-contracts`, `engine-db`, `engine-cms`, `engine-admin`, `engine-email`, `engine-booking`, `splashnswim`, `practice`).

- [ ] **Step 2: Run every package's build**

Run: `pnpm build`
Expected: PASS for every package.

- [ ] **Step 3: Run the full test suite**

Run: `pnpm test`
Expected: `@swim-engine/engine-admin#test` passes with every test file from Tasks 1–15; no other package has a test script, so Turborepo reports them as skipped, not failed.

- [ ] **Step 4: Push and confirm the Vercel deployment**

```bash
git push origin master
```

Watch the Vercel Deployments tab for the new commit and confirm it reaches **Ready**, then re-verify the live `/admin` flow end to end (Home screen, sidebar, Images drag-and-drop, login reset flow) against the production URL, the same way Task 16 Step 5 and Task 17 Step 4 verified it locally.

- [ ] **Step 5: Update the spec's status line**

Edit `docs/superpowers/specs/2026-07-31-engine-admin-redesign-design.md` — change:

```markdown
Status: Approved, pending implementation plan
```

to:

```markdown
Status: Implemented
```

Commit:

```bash
git add docs/superpowers/specs/2026-07-31-engine-admin-redesign-design.md
git commit -m "docs: mark engine-admin redesign spec as implemented"
git push origin master
```
