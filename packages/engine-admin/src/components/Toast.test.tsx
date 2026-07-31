import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./Toast.js";

function TriggerButton({ message }: { message: string }) {
  const { showToast } = useToast();
  return <button onClick={() => showToast(message)}>Trigger</button>;
}

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a toast when showToast is called", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <TriggerButton message="Saved." />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByText("Saved.")).toBeInTheDocument();
  });

  it("auto-dismisses the toast after a few seconds", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ToastProvider>
        <TriggerButton message="Saved." />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByText("Saved.")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.queryByText("Saved.")).not.toBeInTheDocument();
  });

  it("throws a clear error if useToast is called outside a provider", () => {
    function Broken() {
      useToast();
      return null;
    }
    expect(() => render(<Broken />)).toThrow(/useToast must be used within a ToastProvider/);
  });
});
