"use client";

import { useState } from "react";
import type { PageEditorScreenProps } from "../types.js";
import { BlockEditor } from "./BlockEditor.js";
import { Button, Card, ErrorText, TextField } from "./ui.js";
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
  const [published, setPublished] = useState(page.published);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);

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

  async function saveMeta() {
    await run(async () => {
      await onSaveMeta({ title, slug, metaTitle, metaDescription });
      setMetaSaved(true);
    });
  }

  async function togglePublished() {
    await run(async () => {
      await onTogglePublished(!published);
      setPublished(!published);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <a href={backHref} className="text-sm text-slate-500 hover:text-slate-900">
          Back to pages
        </a>
        <div className="flex items-center gap-3">
          <span
            className={
              published
                ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
                : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            }
          >
            {published ? "Published" : "Draft"}
          </span>
          <Button variant="secondary" disabled={busy} onClick={togglePublished}>
            {published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <h1 className="text-lg font-semibold">{title}</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">Page details</h2>
        <TextField label="Title" value={title} onChange={(v) => { setTitle(v); setMetaSaved(false); }} />
        <TextField label="Page address" value={slug} onChange={(v) => { setSlug(v); setMetaSaved(false); }} />
        <TextField
          label="Search engine title (optional)"
          value={metaTitle}
          onChange={(v) => { setMetaTitle(v); setMetaSaved(false); }}
        />
        <TextField
          label="Search engine description (optional)"
          value={metaDescription}
          onChange={(v) => { setMetaDescription(v); setMetaSaved(false); }}
        />
        <div className="flex items-center gap-3">
          <Button onClick={saveMeta} disabled={busy}>
            Save details
          </Button>
          {metaSaved ? <span className="text-sm text-green-700">Saved.</span> : null}
        </div>
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-800">Content</h2>
        <BlockEditor initialBlocks={page.blocks} onSave={onSaveBlocks} />
      </div>
    </div>
  );
}
