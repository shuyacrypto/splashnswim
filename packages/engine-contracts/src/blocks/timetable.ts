import { z } from "zod";
import {
  blockBaseSchema,
  dayOfWeekSchema,
  timeOfDaySchema,
} from "../shared.js";

/** A single session (one row) in the timetable. */
export const timetableSessionSchema = z.object({
  day: dayOfWeekSchema,
  startTime: timeOfDaySchema,
  endTime: timeOfDaySchema,
  title: z.string().min(1),
  level: z.string().optional(),
  location: z.string().optional(),
});
export type TimetableSession = z.infer<typeof timetableSessionSchema>;

/** Timetable: a weekly grid of swimming sessions. */
export const timetableBlockSchema = blockBaseSchema.extend({
  type: z.literal("timetable"),
  heading: z.string().optional(),
  sessions: z.array(timetableSessionSchema).min(1),
});
export type TimetableBlock = z.infer<typeof timetableBlockSchema>;
