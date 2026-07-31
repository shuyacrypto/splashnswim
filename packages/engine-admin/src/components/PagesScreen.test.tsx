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
