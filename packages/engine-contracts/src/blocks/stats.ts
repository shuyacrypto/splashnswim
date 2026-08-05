import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** One number in a stats row. */
export const statItemSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
});
export type StatItem = z.infer<typeof statItemSchema>;

/** Stats: a row of callout numbers, for example results or a track record. */
export const statsBlockSchema = blockBaseSchema.extend({
  type: z.literal("stats"),
  heading: z.string().optional(),
  items: z.array(statItemSchema).min(1),
});
export type StatsBlock = z.infer<typeof statsBlockSchema>;
