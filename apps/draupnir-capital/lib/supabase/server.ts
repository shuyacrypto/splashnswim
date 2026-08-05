import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@swim-engine/engine-db";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * A Supabase client for server components and server actions, reading the
 * signed-in admin's session from cookies.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies cannot be set.
          // The middleware refreshes the session instead, so this is safe.
        }
      },
    },
  });
}
