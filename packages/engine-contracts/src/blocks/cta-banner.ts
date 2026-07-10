import { z } from "zod";
import { blockBaseSchema, ctaSchema } from "../shared.js";

/** CTA banner: a prominent prompt encouraging the visitor to act. */
export const ctaBannerBlockSchema = blockBaseSchema.extend({
  type: z.literal("cta_banner"),
  heading: z.string().min(1),
  body: z.string().optional(),
  cta: ctaSchema,
});
export type CtaBannerBlock = z.infer<typeof ctaBannerBlockSchema>;
