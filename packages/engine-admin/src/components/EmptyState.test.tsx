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
