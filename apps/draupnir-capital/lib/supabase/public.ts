import { createPublicClient } from "@swim-engine/engine-db";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * The public, read-only client used to render the live website. Row Level
 * Security limits it to published content only.
 */
export function getPublicClient() {
  return createPublicClient(supabaseUrl, supabaseAnonKey);
}
