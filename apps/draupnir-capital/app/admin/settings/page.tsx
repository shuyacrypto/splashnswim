"use client";

import { useEffect, useState } from "react";
import { SettingsScreen } from "@swim-engine/engine-admin";
import type { SiteSettings } from "@swim-engine/engine-admin";
import { getSiteSettings, saveSiteSettings } from "@swim-engine/engine-cms";
import { createClientSupabase } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [supabase] = useState(() => createClientSupabase());
  const [settings, setSettings] = useState<SiteSettings | null | undefined>(undefined);

  useEffect(() => {
    void getSiteSettings(supabase).then(setSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (settings === undefined) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <SettingsScreen
      settings={settings}
      onSave={async (next) => {
        const saved = await saveSiteSettings(supabase, next);
        setSettings(saved);
      }}
    />
  );
}
