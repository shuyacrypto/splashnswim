import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { SettingsScreen } from "./SettingsScreen.js";

describe("SettingsScreen", () => {
  it("shows a toast after saving", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <SettingsScreen settings={null} onSave={vi.fn().mockResolvedValue(undefined)} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Save settings" }));
    expect(await screen.findByText("Settings saved.")).toBeInTheDocument();
  });
});
