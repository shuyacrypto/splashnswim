/**
 * Draupnir Capital doesn't have a Supabase project wired up yet — this app is
 * being shown to the client off placeholder credentials so a build never
 * crashes for lack of real ones. `isSupabaseConfigured` lets pages fall back
 * to static content instead of querying a database that doesn't exist yet.
 */
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_ANON_KEY = "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_ANON_KEY;
