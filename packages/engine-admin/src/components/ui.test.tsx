import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonClassName, Card, TextField, Toggle } from "./ui.js";

describe("ui primitives", () => {
  it("Button still calls onClick and renders children", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("buttonClassName returns a non-empty class string for every variant", () => {
    expect(buttonClassName("primary").length).toBeGreaterThan(0);
    expect(buttonClassName("secondary").length).toBeGreaterThan(0);
    expect(buttonClassName("danger").length).toBeGreaterThan(0);
  });

  it("Button's rendered class matches buttonClassName for the same variant", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button", { name: "Cancel" }).className).toBe(
      buttonClassName("secondary"),
    );
  });

  it("TextField still reports changes via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Title" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText("Title"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("Toggle still reports changes via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle label="Enabled" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("Card renders its children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
