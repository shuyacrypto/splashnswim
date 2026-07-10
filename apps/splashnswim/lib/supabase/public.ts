import { createPublicClient } from "@swim-engine/engine-db";

/**
 * The public, read-only client used to render the live website. Row Level
 * Security limits it to published content only.
 */
export function getPublicClient() {
  return createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
