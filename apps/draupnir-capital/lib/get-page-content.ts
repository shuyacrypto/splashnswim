import { getPageBySlug, getSiteSettings } from "@swim-engine/engine-cms";
import type { Page, SiteSettings } from "@swim-engine/engine-contracts";
import { getPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import { FALLBACK_PAGES, FALLBACK_SETTINGS } from "./fallback-content";

/**
 * A page and the site settings, by slug. Reads from Supabase once a project
 * is wired up; until then, serves the same static copy from
 * fallback-content.ts so the site has something to show.
 */
export async function getPageContent(
  slug: string,
): Promise<{ page: Page | null; settings: SiteSettings | null }> {
  if (!isSupabaseConfigured) {
    return { page: FALLBACK_PAGES[slug] ?? null, settings: FALLBACK_SETTINGS };
  }
  const client = getPublicClient();
  const [page, settings] = await Promise.all([
    getPageBySlug(client, slug),
    getSiteSettings(client),
  ]);
  return { page, settings };
}
