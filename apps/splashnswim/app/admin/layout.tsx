"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell, Home, FileText, ImageIcon, Mail, Settings } from "@swim-engine/engine-admin";
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
    { label: "Home", href: "/admin", icon: Home, active: pathname === "/admin" },
    { label: "Pages", href: "/admin/pages", icon: FileText, active: pathname.startsWith("/admin/pages") },
    { label: "Images", href: "/admin/media", icon: ImageIcon, active: pathname === "/admin/media" },
    { label: "Broadcast", href: "/admin/broadcast", icon: Mail, active: pathname === "/admin/broadcast" },
    { label: "Settings", href: "/admin/settings", icon: Settings, active: pathname === "/admin/settings" },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={ADMIN_THEME}>
      <AdminShell
        nav={nav}
        brand={<Logo className="h-11" />}
        footer={
          <button
            type="button"
            onClick={signOut}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--admin-muted,#64748b)] hover:bg-[var(--admin-bg,#f8fafc)] hover:text-[var(--admin-text,#0f172a)]"
          >
            Sign out
          </button>
        }
      >
        {children}
      </AdminShell>
    </div>
  );
}
