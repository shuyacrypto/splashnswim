import { z } from "zod";
import { blockSchema } from "../blocks/index.js";

/**
 * A marketing page: an ordered list of blocks plus its publishing state.
 * The order of `blocks` is the order they appear on the page.
 */
export const pageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  blocks: z.array(blockSchema).default([]),
  published: z.boolean().default(false),
  updatedAt: z.string().datetime().optional(),
});
export type Page = z.infer<typeof pageSchema>;
