import { z } from "zod";

/**
 * Site-wide settings a school admin can edit. Deliberately small: this is
 * not a design surface. Fonts, colours and layout are the skin's job, never
 * the admin's.
 */
export const siteSettingsSchema = z.object({
  schoolName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  /** Whether the optional booking/billing module is switched on. */
  bookingEnabled: z.boolean().default(false),
  socialLinks: z
    .object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      tiktok: z.string().url().optional(),
    })
    .optional(),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
