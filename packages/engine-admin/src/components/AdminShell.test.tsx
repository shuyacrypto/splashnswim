import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminShell } from "./AdminShell.js";
import { useToast } from "./Toast.js";
import { Home, Settings } from "../icons.js";

const nav = [
  { label: "Home", href: "/admin", icon: Home, active: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, active: false },
];

describe("AdminShell", () => {
  it("renders every nav item and the page content", () => {
    render(
      <AdminShell nav={nav}>
        <p>Page content</p>
      </AdminShell>,
    );
    expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: /Settings/ })).toHaveAttribute(
      "href",
      "/admin/settings",
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders the footer slot when provided", () => {
    render(
      <AdminShell nav={nav} footer={<button>Sign out</button>}>
        <p>Page content</p>
      </AdminShell>,
    );
    expect(screen.getAllByRole("button", { name: "Sign out" }).length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(
      <AdminShell nav={nav}>
        <p>Page content</p>
      </AdminShell>,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("lets a child screen show a toast (ToastProvider is included)", async () => {
    function ScreenWithToast() {
      const { showToast } = useToast();
      return (
        <div>
          <p>Page content</p>
          <button onClick={() => showToast("Saved.")}>Trigger toast</button>
        </div>
      );
    }
    const user = userEvent.setup();
    render(
      <AdminShell nav={nav}>
        <ScreenWithToast />
      </AdminShell>,
    );
    await user.click(screen.getByRole("button", { name: "Trigger toast" }));
    expect(screen.getByText("Saved.")).toBeInTheDocument();
  });
});
