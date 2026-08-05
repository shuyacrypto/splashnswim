import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** One card in a feature grid. */
export const featureItemSchema = z.object({
  // Key into a small, fixed icon set (a lucide-react name) that engine-admin
  // offers as a dropdown, never free-text design input.
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
});
export type FeatureItem = z.infer<typeof featureItemSchema>;

/**
 * Feature grid: a grid of cards. Set `numbered` for a sequential process
 * (for example "how it works"); leave it off for an unordered set of
 * highlights (for example services or facility types).
 */
export const featureGridBlockSchema = blockBaseSchema.extend({
  type: z.literal("feature_grid"),
  heading: z.string().optional(),
  numbered: z.boolean().default(false),
  items: z.array(featureItemSchema).min(1),
});
export type FeatureGridBlock = z.infer<typeof featureGridBlockSchema>;
