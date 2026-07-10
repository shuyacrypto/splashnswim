import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";

/** A Supabase client that knows this engine's database schema. */
export type EngineDbClient = SupabaseClient<Database>;

/**
 * Creates the public client, using the anon key. This is what the live
 * website uses. Row Level Security limits it to published content only, so it
 * is safe to use in the browser.
 */
export function createPublicClient(
  supabaseUrl: string,
  anonKey: string,
): EngineDbClient {
  return createClient<Database>(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Creates the admin client, using the secret service-role key. This bypasses
 * Row Level Security, so it must only ever run on the server and its key must
 * never be sent to the browser.
 */
export function createAdminClient(
  supabaseUrl: string,
  serviceRoleKey: string,
): EngineDbClient {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
