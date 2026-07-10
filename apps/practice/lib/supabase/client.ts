"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@swim-engine/engine-db";

/**
 * The browser Supabase client. It carries the signed-in admin's session, so
 * the engine's Row Level Security treats it as an authenticated admin. This is
 * what the admin screens use to read and change content.
 */
export function createClientSupabase() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
