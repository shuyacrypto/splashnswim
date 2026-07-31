"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import type { MediaScreenProps } from "../types.js";
import { Button, Card, ErrorText } from "./ui.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { EmptyState } from "./EmptyState.js";
import { useToast } from "./Toast.js";
import { UploadCloud, ImageIcon, Trash2 } from "../icons.js";
import { errorMessages } from "../helpers.js";

/** The original filename is stored after a timestamp prefix, e.g.
 * "1700000000000-pool.jpg" — this strips that prefix for display. */
function displayFilename(storagePath: string): string {
  return storagePath.replace(/^\d+-/, "");
}

export function MediaScreen({ items, publicUrl, onUpload, onUpdateAlt, onDelete }: MediaScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  // The preview is a blob: URL created for whichever file is currently
  // pending upload. Whenever it changes (a new file is chosen, the pending
  // file is cleared after upload) or the component unmounts, revoke the
  // previous URL so we don't leak memory.
  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  async function run(action: () => Promise<void>) {
    setErrors([]);
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setErrors(errorMessages(error));
    } finally {
      setBusy(false);
    }
  }

  function selectFile(file: File) {
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  function onFileInputChange() {
    const file = fileInput.current?.files?.[0];
    if (file) selectFile(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) selectFile(file);
  }

  async function confirmUpload() {
    if (!pendingFile) {
      setErrors(["Please choose an image to upload."]);
      return;
    }
    const file = pendingFile;
    await run(async () => {
      await onUpload(file);
      showToast("Image uploaded.");
      setPendingFile(null);
      setPendingPreview(null);
      if (fileInput.current) fileInput.current.value = "";
    });
  }

  async function saveAlt(id: string, alt: string) {
    await run(async () => {
      await onUpdateAlt(id, alt);
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleteTarget(null);
    await run(async () => {
      await onDelete(id);
      showToast("Image deleted.");
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">Images</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Upload an image</h2>
        <div
          data-testid="upload-drop-zone"
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={
            dragActive
              ? "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--admin-primary,#0f172a)] bg-[var(--admin-bg,#f8fafc)] p-8 text-center"
              : "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[var(--admin-border,#e2e8f0)] p-8 text-center"
          }
        >
          <UploadCloud className="h-8 w-8 text-[var(--admin-muted,#64748b)]" />
          <p className="text-sm text-[var(--admin-muted,#64748b)]">
            Drag an image here, or{" "}
            <label className="cursor-pointer font-semibold text-[var(--admin-primary,#0f172a)] underline">
              choose a file
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                aria-label="Choose a file to upload"
                onChange={onFileInputChange}
                className="sr-only"
              />
            </label>
          </p>
          {pendingPreview ? (
            <div className="mt-3 flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingPreview} alt="Preview" className="h-24 w-24 rounded-xl object-cover" />
              <p className="text-xs text-[var(--admin-muted,#64748b)]">{pendingFile?.name}</p>
              <Button onClick={confirmUpload} disabled={busy}>
                {busy ? "Uploading..." : "Upload"}
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No images yet"
          description="Upload your first image above to start building your gallery."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicUrl(item.storagePath)}
                alt={item.alt}
                className="h-32 w-full rounded-xl object-cover"
              />
              <p className="truncate text-xs font-medium text-[var(--admin-text,#0f172a)]">
                {displayFilename(item.storagePath)}
              </p>
              <AltTextField value={item.alt} onSave={(next) => saveAlt(item.id, next)} />
              <Button variant="danger" disabled={busy} onClick={() => setDeleteTarget(item.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this image?"
        message="This cannot be undone. Pages using this image will show a broken image until it is replaced."
        confirmLabel="Delete image"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/** Tracks its own draft text and only saves on blur, so typing doesn't fire
 * a network call on every keystroke. */
function AltTextField({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--admin-muted,#64748b)]">
        Description of the image (alt text)
      </span>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (draft !== value) onSave(draft);
        }}
        className="block w-full rounded-2xl border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] px-4 py-3 text-sm text-[var(--admin-text,#0f172a)] transition-colors focus:border-[var(--admin-primary,#0f172a)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary,#0f172a)]"
      />
    </label>
  );
}
