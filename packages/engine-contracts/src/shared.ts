import { z } from "zod";

/**
 * Small, reusable pieces shared by several block types.
 * Keeping them here means a change is made in one place only.
 */

/** A call-to-action button: the words on it and where it points. */
export const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export type Cta = z.infer<typeof ctaSchema>;

/** An image reference. `alt` may be empty for purely decorative images. */
export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  caption: z.string().optional(),
});
export type Image = z.infer<typeof imageSchema>;

/**
 * Every content block carries a stable id so admins can reorder blocks
 * without the identity of a block changing.
 */
export const blockBaseSchema = z.object({
  id: z.string().min(1),
});

/** Days of the week, used by the timetable block. */
export const dayOfWeekSchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;

/** A time in 24-hour HH:MM form, for example "09:30". */
export const timeOfDaySchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour HH:MM, for example 09:30");
