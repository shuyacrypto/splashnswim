import { z } from "zod";
import { blockBaseSchema, ctaSchema } from "../shared.js";

/** One column in the pricing table. */
export const pricingTierSchema = z.object({
  name: z.string().min(1),
  /** Display price as written by the admin, for example "£45 per month". */
  price: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  cta: ctaSchema.optional(),
  highlighted: z.boolean().default(false),
});
export type PricingTier = z.infer<typeof pricingTierSchema>;

/** Pricing table: a set of pricing options shown side by side. */
export const pricingTableBlockSchema = blockBaseSchema.extend({
  type: z.literal("pricing_table"),
  heading: z.string().optional(),
  tiers: z.array(pricingTierSchema).min(1),
});
export type PricingTableBlock = z.infer<typeof pricingTableBlockSchema>;
