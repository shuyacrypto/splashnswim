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
    // Scoped to the block header's span (font-semibold) because the same
    // text also appears as an <option> in the "Add a block" select, and
    // "Text" additionally collides with the rich_text field's own label.
    expect(screen.getByText("Hero banner", { selector: "span.font-semibold" })).toBeInTheDocument();
    expect(screen.getByText("Text", { selector: "span.font-semibold" })).toBeInTheDocument();
  });
});
