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
