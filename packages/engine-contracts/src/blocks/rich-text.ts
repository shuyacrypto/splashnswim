import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** Rich text: a heading and a body of formatted prose. */
export const richTextBlockSchema = blockBaseSchema.extend({
  type: z.literal("rich_text"),
  heading: z.string().optional(),
  content: z.string().min(1),
});
export type RichTextBlock = z.infer<typeof richTextBlockSchema>;
