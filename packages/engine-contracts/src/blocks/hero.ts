import { z } from "zod";
import { blockBaseSchema, ctaSchema, imageSchema } from "../shared.js";

/** Hero: the large banner at the top of a page. */
export const heroBlockSchema = blockBaseSchema.extend({
  type: z.literal("hero"),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  backgroundImage: imageSchema.optional(),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
});
export type HeroBlock = z.infer<typeof heroBlockSchema>;
