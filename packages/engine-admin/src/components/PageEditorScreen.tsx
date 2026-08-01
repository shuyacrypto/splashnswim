"use client";

import { useState } from "react";
import type { Block } from "@swim-engine/engine-contracts";
import type { PageEditorScreenProps } from "../types.js";
import { BlockEditor } from "./BlockEditor.js";
import { Button, Card, ErrorText, TextField } from "./ui.js";
import { StatusBadge } from "./StatusBadge.js";
import { useToast } from "./Toast.js";
import { errorMessages } from "../helpers.js";

export function PageEditorScreen({
  page,
  backHref,
  onSaveBlocks,
  onSaveMeta,
  onTogglePublished,
}: PageEditorScreenProps) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  const [blocks, setBlocks] = useState<Block[]>(page.blocks);
  const [published, setPublished] = useState(page.published);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

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

  async function saveAll() {
    await run(async () => {
      await onSaveMeta({ title, slug, metaTitle, metaDescription });
      await onSaveBlocks(blocks);
      showToast("All changes saved.");
    });
  }

  async function togglePublished() {
    await run(async () => {
      await onTogglePublished(!published);
      setPublished(!published);
      showToast(published ? "Page unpublished." : "Page published.");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <a
          href={backHref}
          className="text-sm font-medium text-[var(--admin-muted,#64748b)] hover:text-[var(--admin-text,#0f172a)]"
        >
          Back to pages
        </a>
        <div className="flex items-center gap-3">
          <StatusBadge status={published ? "published" : "draft"} />
          <Button variant="secondary" disabled={busy} onClick={togglePublished}>
            {published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[var(--admin-text,#0f172a)]">{title}</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Page details</h2>
        <TextField label="Title" value={title} onChange={setTitle} />
        <TextField label="Page address" value={slug} onChange={setSlug} />
        <TextField label="Search engine title (optional)" value={metaTitle} onChange={setMetaTitle} />
        <TextField
          label="Search engine description (optional)"
          value={metaDescription}
          onChange={setMetaDescription}
        />
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-[var(--admin-text,#0f172a)]">Content</h2>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </div>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-2xl border border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-3 shadow-lg">
        <Button onClick={saveAll} disabled={busy}>
          {busy ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
