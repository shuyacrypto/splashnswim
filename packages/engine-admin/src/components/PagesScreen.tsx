"use client";

import { useState } from "react";
import type { PagesScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextField } from "./ui.js";
import { errorMessages } from "../helpers.js";

export function PagesScreen({
  pages,
  editHref,
  onCreatePage,
  onTogglePublished,
  onDeletePage,
}: PagesScreenProps) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
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

  async function create() {
    await run(async () => {
      await onCreatePage({ slug, title });
      setSlug("");
      setTitle("");
    });
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete the page "${name}"? This cannot be undone.`)) return;
    await run(() => onDeletePage(id));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Pages</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-slate-800">Create a new page</h2>
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="About us"
        />
        <TextField
          label="Page address"
          value={slug}
          onChange={setSlug}
          placeholder="about-us"
        />
        <Button onClick={create} disabled={busy}>
          Create page
        </Button>
      </Card>

      <div className="space-y-2">
        {pages.length === 0 ? (
          <p className="text-sm text-slate-500">No pages yet.</p>
        ) : (
          pages.map((page) => (
            <Card key={page.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <a
                    href={editHref(page.id)}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    {page.title}
                  </a>
                  <p className="text-xs text-slate-500">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      page.published
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    }
                  >
                    {page.published ? "Published" : "Draft"}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={busy}
                    onClick={() => run(() => onTogglePublished(page.id, !page.published))}
                  >
                    {page.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => remove(page.id, page.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
