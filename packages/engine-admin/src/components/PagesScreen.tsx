"use client";

import { useState } from "react";
import type { PagesScreenProps } from "../types.js";
import { Button, Card, ErrorText, TextField } from "./ui.js";
import { StatusBadge } from "./StatusBadge.js";
import { EmptyState } from "./EmptyState.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { useToast } from "./Toast.js";
import { FileText } from "../icons.js";
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
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
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

  async function create() {
    await run(async () => {
      await onCreatePage({ slug, title });
      showToast(`"${title}" created.`);
      setSlug("");
      setTitle("");
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    await run(async () => {
      await onDeletePage(id);
      showToast("Page deleted.");
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-[var(--admin-text,#0f172a)]">Pages</h1>

      <ErrorText messages={errors} />

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Create a new page</h2>
        <TextField label="Title" value={title} onChange={setTitle} placeholder="About us" />
        <TextField label="Page address" value={slug} onChange={setSlug} placeholder="about-us" />
        <Button onClick={create} disabled={busy}>
          Create page
        </Button>
      </Card>

      {pages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No pages yet"
          description="Create your first page above to start building your site."
        />
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <Card key={page.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <a
                    href={editHref(page.id)}
                    className="text-sm font-semibold text-[var(--admin-text,#0f172a)] hover:underline"
                  >
                    {page.title}
                  </a>
                  <p className="text-xs text-[var(--admin-muted,#64748b)]">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={page.published ? "published" : "draft"} />
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
                    onClick={() => setDeleteTarget({ id: page.id, title: page.title })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this page?"
        message={deleteTarget ? `Delete the page "${deleteTarget.title}"? This cannot be undone.` : ""}
        confirmLabel="Delete page"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
