"use client";

import { useEffect, useState } from "react";
import { MediaScreen } from "@swim-engine/engine-admin";
import type { MediaItem } from "@swim-engine/engine-admin";
import {
  listMedia,
  uploadImage,
  updateMediaAlt,
  deleteMedia,
  getPublicUrl,
} from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

export default function AdminMediaPage() {
  const [supabase] = useState(() => createClientSupabase());
  const [items, setItems] = useState<MediaItem[] | null>(null);

  async function refresh() {
    setItems(await listMedia(supabase));
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <MediaScreen
      items={items}
      publicUrl={(storagePath) => getPublicUrl(supabase, storagePath)}
      onUpload={async (file) => {
        const bytes = new Uint8Array(await file.arrayBuffer());
        await uploadImage(supabase, {
          path: `${Date.now()}-${file.name}`,
          file: bytes,
          contentType: file.type,
          alt: file.name,
        });
        await refresh();
      }}
      onUpdateAlt={async (id, alt) => {
        await updateMediaAlt(supabase, id, alt);
        await refresh();
      }}
      onDelete={async (id) => {
        await deleteMedia(supabase, id);
        await refresh();
      }}
    />
  );
}
