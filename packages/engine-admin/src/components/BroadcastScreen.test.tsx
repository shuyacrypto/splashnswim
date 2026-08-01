import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { BroadcastScreen } from "./BroadcastScreen.js";

function renderScreen(onSend = vi.fn().mockResolvedValue(undefined)) {
  return render(
    <ToastProvider>
      <BroadcastScreen recipientCount={12} audienceLabel="parents" onSend={onSend} />
    </ToastProvider>,
  );
}

describe("BroadcastScreen", () => {
  it("asks for confirmation before sending, and only sends on confirm", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderScreen(onSend);
    await user.type(screen.getByLabelText("Subject"), "Pool closure");
    await user.type(screen.getByLabelText("Message"), "The pool is closed this weekend.");
    await user.click(screen.getByRole("button", { name: "Send broadcast" }));
    expect(onSend).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Send to 12 parents" }));
    expect(onSend).toHaveBeenCalledWith("Pool closure", "The pool is closed this weekend.");
  });

  it("shows a toast after sending", async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.type(screen.getByLabelText("Subject"), "Pool closure");
    await user.type(screen.getByLabelText("Message"), "The pool is closed this weekend.");
    await user.click(screen.getByRole("button", { name: "Send broadcast" }));
    await user.click(screen.getByRole("button", { name: "Send to 12 parents" }));
    expect(await screen.findByText("Your message has been sent.")).toBeInTheDocument();
  });
});
