"use client";

import { useRef, useState } from "react";
import type { MediaScreenProps } from "../types.js";
import { Button, Card, ErrorText } from "./ui.js";
import { errorMessages } from "../helpers.js";

export function MediaScreen({ items, publicUrl, onUpload, onDelete }: MediaScreenProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

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

  async function upload() {
    const file = fileInput.current?.files?.[0];
    if (!file) {
      setErrors(["Please choose an image to upload."]);
      return;
    }
    await run(async () => {
      await onUpload(file);
      if (fileInput.current) fileInput.current.value = "";
    });
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    await run(() => onDelete(id));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Images</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">Upload an image</h2>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="block text-sm text-slate-700"
        />
        <Button onClick={upload} disabled={busy}>
          {busy ? "Uploading..." : "Upload"}
        </Button>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No images uploaded yet.</p>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicUrl(item.storagePath)}
                alt={item.alt}
                className="h-32 w-full rounded object-cover"
              />
              <p className="truncate text-xs text-slate-500">{item.storagePath}</p>
              <Button variant="danger" disabled={busy} onClick={() => remove(item.id)}>
                Delete
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
