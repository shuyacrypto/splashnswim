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
