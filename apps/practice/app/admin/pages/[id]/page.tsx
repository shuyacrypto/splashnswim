"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageEditorScreen } from "@swim-engine/engine-admin";
import type { Page } from "@swim-engine/engine-admin";
import {
  getPageById,
  updatePageBlocks,
  updatePageMeta,
  setPagePublished,
} from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

export default function AdminPageEditor() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [supabase] = useState(() => createClientSupabase());
  const [page, setPage] = useState<Page | null | undefined>(undefined);

  useEffect(() => {
    void getPageById(supabase, id).then(setPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (page === undefined) return <p className="text-sm text-slate-500">Loading...</p>;
  if (page === null) return <p className="text-sm text-slate-500">Page not found.</p>;

  return (
    <PageEditorScreen
      page={page}
      backHref="/admin/pages"
      onSaveBlocks={async (blocks) => {
        await updatePageBlocks(supabase, id, blocks);
      }}
      onSaveMeta={async (meta) => {
        await updatePageMeta(supabase, id, {
          title: meta.title,
          slug: meta.slug,
          metaTitle: meta.metaTitle === "" ? null : meta.metaTitle,
          metaDescription: meta.metaDescription === "" ? null : meta.metaDescription,
        });
      }}
      onTogglePublished={async (published) => {
        await setPagePublished(supabase, id, published);
      }}
    />
  );
}
