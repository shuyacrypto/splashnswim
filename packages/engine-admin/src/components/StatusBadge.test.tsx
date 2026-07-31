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
