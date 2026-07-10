import { z } from "zod";
import { ContentValidationError } from "./errors.js";

/**
 * Validates data against a schema from engine-contracts. On success it returns
 * the clean, typed value. On failure it throws a ContentValidationError with
 * readable messages, so nothing invalid can ever reach the database.
 */
export function parseOrThrow<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown,
  label: string,
): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const where = issue.path.join(".") || "(root)";
      return `${where}: ${issue.message}`;
    });
    throw new ContentValidationError(`${label} is not valid.`, issues);
  }
  return result.data;
}
