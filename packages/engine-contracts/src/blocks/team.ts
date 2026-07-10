import { z } from "zod";
import { blockBaseSchema, imageSchema } from "../shared.js";

/** A single member of staff. */
export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: imageSchema.optional(),
  bio: z.string().optional(),
});
export type TeamMember = z.infer<typeof teamMemberSchema>;

/** Team: introduce the people at the school. */
export const teamBlockSchema = blockBaseSchema.extend({
  type: z.literal("team"),
  heading: z.string().optional(),
  members: z.array(teamMemberSchema).min(1),
});
export type TeamBlock = z.infer<typeof teamBlockSchema>;
