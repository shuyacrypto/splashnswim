import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <p>Hello, admin.</p>;
}

describe("test infrastructure", () => {
  it("renders a component and finds it with Testing Library", () => {
    render(<Hello />);
    expect(screen.getByText("Hello, admin.")).toBeInTheDocument();
  });
});
