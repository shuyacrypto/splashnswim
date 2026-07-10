/**
 * Errors this package can throw. Keeping them as named types lets the admin
 * panel show a helpful message rather than a raw technical error.
 */

/** Thrown when content fails validation and so must not be saved. */
export class ContentValidationError extends Error {
  /** One readable line per problem found, suitable for showing to an admin. */
  readonly issues: string[];

  constructor(message: string, issues: string[]) {
    super(message);
    this.name = "ContentValidationError";
    this.issues = issues;
  }
}

/** Thrown when the thing being edited or deleted no longer exists. */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
