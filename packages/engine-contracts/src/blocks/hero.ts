import { z } from "zod";
import { blockBaseSchema, ctaSchema, imageSchema } from "../shared.js";

/** Hero: the large banner at the top of a page. */
export const heroBlockSchema = blockBaseSchema.extend({
  type: z.literal("hero"),
  /** A short label shown above the heading, for example "Institutional Private Credit". */
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  backgroundImage: imageSchema.optional(),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
});
export type HeroBlock = z.infer<typeof heroBlockSchema>;
