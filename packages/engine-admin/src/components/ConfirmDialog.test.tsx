import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog.js";

function DummyInput() {
  return <input type="text" aria-label="Somewhere else" />;
}

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

  it("does not re-steal focus when onCancel's identity changes while open stays true", () => {
    const { rerender } = render(
      <>
        <ConfirmDialog
          open
          title="Delete this page?"
          message="This cannot be undone."
          confirmLabel="Delete"
          onConfirm={vi.fn()}
          onCancel={() => {}}
        />
        <DummyInput />
      </>,
    );

    // Sanity check: the effect's initial mount focused the Cancel button.
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();

    // Simulate the user tabbing away to interact with something else (e.g. the
    // Confirm/Delete button) mid-dialog, moving focus off the Cancel button.
    const elsewhere = screen.getByLabelText("Somewhere else");
    elsewhere.focus();
    expect(elsewhere).toHaveFocus();

    // Re-render with `open` still true but a brand new `onCancel` reference,
    // mimicking a parent re-render (e.g. triggered by an unrelated toast)
    // that recreates the inline `onCancel={() => ...}` callback.
    rerender(
      <>
        <ConfirmDialog
          open
          title="Delete this page?"
          message="This cannot be undone."
          confirmLabel="Delete"
          onConfirm={vi.fn()}
          onCancel={() => {}}
        />
        <DummyInput />
      </>,
    );

    // The effect must not have re-run just because `onCancel` got a new
    // identity, so focus should remain wherever the user left it.
    expect(elsewhere).toHaveFocus();
    expect(screen.getByRole("button", { name: "Cancel" })).not.toHaveFocus();
  });
});
