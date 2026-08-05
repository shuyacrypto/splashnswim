"use client";

import { useEffect, useState } from "react";
import { HomeScreen } from "@swim-engine/engine-admin";
import type { HomeScreenStats } from "@swim-engine/engine-admin";
import { listPages, listMedia } from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

function relativeTime(iso: string): string {
  const diffMinutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function AdminHome() {
  const [supabase] = useState(() => createClientSupabase());
  const [stats, setStats] = useState<HomeScreenStats | null>(null);

  useEffect(() => {
    async function load() {
      const [pages, media] = await Promise.all([listPages(supabase), listMedia(supabase)]);
      const mostRecent = pages[0] ?? null;
      setStats({
        totalPages: pages.length,
        publishedPages: pages.filter((page) => page.published).length,
        totalImages: media.length,
        lastEdited: mostRecent
          ? { title: mostRecent.title, relativeTime: relativeTime(mostRecent.updatedAt) }
          : null,
      });
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <HomeScreen
      businessName="SplashNSwim"
      stats={stats}
      newPageHref="/admin/pages"
      uploadImagesHref="/admin/media"
      broadcastHref="/admin/broadcast"
    />
  );
}
