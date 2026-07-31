import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./Toast.js";
import { MediaScreen } from "./MediaScreen.js";

const items = [
  { id: "1", storagePath: "1700000000000-pool.jpg", alt: "Pool", createdAt: "2026-07-01T00:00:00Z" },
];

// jsdom does not implement URL.createObjectURL/revokeObjectURL at all (both
// are `undefined`), so the component's preview logic needs these patched in
// for the whole file. This is done once via beforeAll/afterAll rather than
// per-test stubbing: React Testing Library's own automatic unmount cleanup
// also runs in an afterEach, and per-test vi.stubGlobal/unstubAllGlobals
// raced against it, restoring the real (method-less) URL before the
// component's unmount effect had a chance to call revokeObjectURL.
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => "blob:mock-preview-url");
  URL.revokeObjectURL = vi.fn();
});

afterAll(() => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

function renderScreen(overrides: Partial<React.ComponentProps<typeof MediaScreen>> = {}) {
  return render(
    <ToastProvider>
      <MediaScreen
        items={items}
        publicUrl={(path) => `https://example.com/${path}`}
        onUpload={vi.fn().mockResolvedValue(undefined)}
        onUpdateAlt={vi.fn().mockResolvedValue(undefined)}
        onDelete={vi.fn().mockResolvedValue(undefined)}
        {...overrides}
      />
    </ToastProvider>,
  );
}

describe("MediaScreen", () => {
  it("shows an empty state when there are no images", () => {
    renderScreen({ items: [] });
    expect(screen.getByText(/No images/)).toBeInTheDocument();
  });

  it("shows the original filename instead of the raw storage path", () => {
    renderScreen();
    expect(screen.getByText("pool.jpg")).toBeInTheDocument();
    expect(screen.queryByText("1700000000000-pool.jpg")).not.toBeInTheDocument();
  });

  it("uploads the file chosen in the file input", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onUpload });
    const file = new File(["data"], "new-photo.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/Choose a file/i) as HTMLInputElement;
    await userEvent.upload(input, file);
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it("uploads a file dropped onto the drop zone", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onUpload });
    const file = new File(["data"], "dropped.jpg", { type: "image/jpeg" });
    const dropZone = screen.getByTestId("upload-drop-zone");
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    expect(await screen.findByText("dropped.jpg")).toBeInTheDocument();
  });

  it("asks for confirmation before deleting, and only deletes on confirm", async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onDelete });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Delete image" }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("saves alt text edited inline when the field loses focus", async () => {
    const onUpdateAlt = vi.fn().mockResolvedValue(undefined);
    renderScreen({ onUpdateAlt });
    const altField = screen.getByLabelText("Description of the image (alt text)");
    await userEvent.clear(altField);
    await userEvent.type(altField, "Children swimming");
    await userEvent.tab();
    expect(onUpdateAlt).toHaveBeenCalledWith("1", "Children swimming");
  });
});
