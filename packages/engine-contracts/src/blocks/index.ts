import { z } from "zod";

import { heroBlockSchema } from "./hero.js";
import { richTextBlockSchema } from "./rich-text.js";
import { imageBlockSchema } from "./image.js";
import { galleryBlockSchema } from "./gallery.js";
import { timetableBlockSchema } from "./timetable.js";
import { pricingTableBlockSchema } from "./pricing-table.js";
import { faqBlockSchema } from "./faq.js";
import { teamBlockSchema } from "./team.js";
import { ctaBannerBlockSchema } from "./cta-banner.js";
import { contactBlockSchema } from "./contact.js";

export * from "./hero.js";
export * from "./rich-text.js";
export * from "./image.js";
export * from "./gallery.js";
export * from "./timetable.js";
export * from "./pricing-table.js";
export * from "./faq.js";
export * from "./team.js";
export * from "./cta-banner.js";
export * from "./contact.js";

/**
 * The complete, closed list of block types. This is the whole set for v1.
 * New block types are a deliberate engine change, never added ad hoc.
 */
export const BLOCK_TYPES = [
  "hero",
  "rich_text",
  "image",
  "gallery",
  "timetable",
  "pricing_table",
  "faq",
  "team",
  "cta_banner",
  "contact",
] as const;

/**
 * A block is exactly one of the ten types, chosen by its `type` field.
 * Any content that does not match one of these cannot be saved.
 */
export const blockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  richTextBlockSchema,
  imageBlockSchema,
  galleryBlockSchema,
  timetableBlockSchema,
  pricingTableBlockSchema,
  faqBlockSchema,
  teamBlockSchema,
  ctaBannerBlockSchema,
  contactBlockSchema,
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
