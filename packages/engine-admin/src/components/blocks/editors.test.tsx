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
