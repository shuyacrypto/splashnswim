import { z } from "zod";
import { blockBaseSchema, imageSchema } from "../shared.js";

/** Gallery: a set of images shown together. */
export const galleryBlockSchema = blockBaseSchema.extend({
  type: z.literal("gallery"),
  heading: z.string().optional(),
  images: z.array(imageSchema).min(1),
});
export type GalleryBlock = z.infer<typeof galleryBlockSchema>;
