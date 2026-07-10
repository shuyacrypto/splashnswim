import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** A single question-and-answer pair. */
export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});
export type FaqItem = z.infer<typeof faqItemSchema>;

/** FAQ: a list of frequently asked questions and their answers. */
export const faqBlockSchema = blockBaseSchema.extend({
  type: z.literal("faq"),
  heading: z.string().optional(),
  items: z.array(faqItemSchema).min(1),
});
export type FaqBlock = z.infer<typeof faqBlockSchema>;
