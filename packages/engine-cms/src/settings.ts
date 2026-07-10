import {
  siteSettingsSchema,
  type SiteSettings,
} from "@swim-engine/engine-contracts";
import type { Database, EngineDbClient } from "@swim-engine/engine-db";
import { parseOrThrow } from "./validation.js";

type SettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

function rowToSettings(row: SettingsRow): SiteSettings {
  return {
    schoolName: row.school_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone ?? undefined,
    bookingEnabled: row.booking_enabled,
    socialLinks: row.social_links,
  };
}

/** The site's settings, or null if they have not been set up yet. */
export async function getSiteSettings(
  client: EngineDbClient,
): Promise<SiteSettings | null> {
  const { data, error } = await client
    .from("site_settings")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToSettings(data) : null;
}

/**
 * Creates or updates the single site settings row. The input is validated
 * against engine-contracts before saving.
 */
export async function saveSiteSettings(
  client: EngineDbClient,
  input: SiteSettings,
): Promise<SiteSettings> {
  const value = parseOrThrow(siteSettingsSchema, input, "Site settings");
  const { data, error } = await client
    .from("site_settings")
    .upsert({
      id: true,
      school_name: value.schoolName,
      contact_email: value.contactEmail,
      contact_phone: value.contactPhone ?? null,
      booking_enabled: value.bookingEnabled,
      social_links: value.socialLinks ?? {},
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return rowToSettings(data);
}
