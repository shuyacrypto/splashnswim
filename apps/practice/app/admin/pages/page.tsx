"use client";

import { useEffect, useState } from "react";
import { PagesScreen } from "@swim-engine/engine-admin";
import type { PageSummary } from "@swim-engine/engine-admin";
import {
  listPages,
  createPage,
  setPagePublished,
  deletePage,
} from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

export default function AdminPagesPage() {
  const [supabase] = useState(() => createClientSupabase());
  const [pages, setPages] = useState<PageSummary[] | null>(null);

  async function refresh() {
    setPages(await listPages(supabase));
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pages) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <PagesScreen
      pages={pages}
      editHref={(id) => `/admin/pages/${id}`}
      onCreatePage={async (input) => {
        await createPage(supabase, input);
        await refresh();
      }}
      onTogglePublished={async (id, published) => {
        await setPagePublished(supabase, id, published);
        await refresh();
      }}
      onDeletePage={async (id) => {
        await deletePage(supabase, id);
        await refresh();
      }}
    />
  );
}
