import { z } from "zod";
import { blockBaseSchema } from "../shared.js";

/** Contact: how to reach the school, with an optional enquiry form. */
export const contactBlockSchema = blockBaseSchema.extend({
  type: z.literal("contact"),
  heading: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  mapEmbedUrl: z.string().url().optional(),
  showEnquiryForm: z.boolean().default(false),
});
export type ContactBlock = z.infer<typeof contactBlockSchema>;
