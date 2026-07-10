import { z } from "zod";
import { blockBaseSchema, imageSchema } from "../shared.js";

/** Image: a single picture, optionally with a caption. */
export const imageBlockSchema = blockBaseSchema.extend({
  type: z.literal("image"),
  image: imageSchema,
});
export type ImageBlock = z.infer<typeof imageBlockSchema>;
