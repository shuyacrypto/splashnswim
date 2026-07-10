"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@swim-engine/engine-admin";
import { createClientSupabase } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());

  const nav = [
    { label: "Pages", href: "/admin/pages", active: pathname.startsWith("/admin/pages") },
    { label: "Settings", href: "/admin/settings", active: pathname === "/admin/settings" },
    { label: "Images", href: "/admin/media", active: pathname === "/admin/media" },
    { label: "Broadcast", href: "/admin/broadcast", active: pathname === "/admin/broadcast" },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <AdminShell nav={nav}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={signOut}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Sign out
        </button>
      </div>
      {children}
    </AdminShell>
  );
}
