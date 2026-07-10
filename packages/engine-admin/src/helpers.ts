/**
 * Turns any thrown error into readable lines for an admin to see. It
 * recognises the validation errors from engine-cms (which carry a list of
 * specific problems) without importing that package's code into the browser.
 */
export function errorMessages(error: unknown): string[] {
  if (typeof error === "object" && error !== null && "issues" in error) {
    const issues = (error as { issues: unknown }).issues;
    if (
      Array.isArray(issues) &&
      issues.length > 0 &&
      issues.every((item): item is string => typeof item === "string")
    ) {
      return issues;
    }
  }
  if (error instanceof Error && error.message) return [error.message];
  return ["Something went wrong. Please try again."];
}
