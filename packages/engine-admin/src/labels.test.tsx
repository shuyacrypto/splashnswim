import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { BLOCK_LABELS, BLOCK_ICONS } from "./labels.js";

describe("BLOCK_ICONS", () => {
  it("has exactly one icon per block type in BLOCK_LABELS", () => {
    const labelTypes = Object.keys(BLOCK_LABELS).sort();
    const iconTypes = Object.keys(BLOCK_ICONS).sort();
    expect(iconTypes).toEqual(labelTypes);
  });

  it("maps each block type to a component that renders an SVG icon", () => {
    for (const Icon of Object.values(BLOCK_ICONS)) {
      const { container } = render(<Icon />);
      expect(container.querySelector("svg")).not.toBeNull();
    }
  });
});
