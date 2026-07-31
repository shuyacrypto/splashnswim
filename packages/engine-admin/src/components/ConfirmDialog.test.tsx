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
