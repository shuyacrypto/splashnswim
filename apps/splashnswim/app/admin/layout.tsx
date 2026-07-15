"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@swim-engine/engine-admin";
import { Logo } from "@/components/Brand";
import { createClientSupabase } from "@/lib/supabase/client";

/**
 * SplashNSwim admin theme. The engine admin is neutral by default; here we set
 * the --admin-* variables to the SplashNSwim palette so this school's admin is
 * on brand. Other schools would set their own (or use the neutral defaults).
 */
const ADMIN_THEME = {
  "--admin-bg": "#eef9fc",
  "--admin-surface": "#ffffff",
  "--admin-border": "#d3ecf3",
  "--admin-text": "#0e2a3b",
  "--admin-muted": "#5b7a8a",
  "--admin-primary": "#0c5278",
  "--admin-primary-hover": "#082d48",
  "--admin-on-primary": "#ffffff",
} as CSSProperties;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());

  const nav = [
    { label: "Pages", href: "/admin/pages", active: pathname.startsWith("/admin/pages") },
    { label: "Settings", href: "/admin/settings", active: pathname === "/admin/settings" },
    { label: "Images", href: "/admin/media", active: pathname === "/admin/media" },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={ADMIN_THEME}>
      <AdminShell nav={nav} brand={<Logo className="h-11" />}>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={signOut}
            className="text-sm font-medium text-[var(--admin-muted,#64748b)] hover:text-[var(--admin-text,#0f172a)]"
          >
            Sign out
          </button>
        </div>
        {children}
      </AdminShell>
    </div>
  );
}
