/**
 * engine-cms is the only sanctioned way to read or change content. It wraps
 * engine-db, validates everything against engine-contracts before saving, and
 * exposes plain functions the admin panel and public site call.
 *
 * Apps and skins call these functions; they never query the database directly.
 */

export { ContentValidationError, NotFoundError } from "./errors.js";
export { parseOrThrow } from "./validation.js";

export {
  listPages,
  getPageBySlug,
  getPageById,
  createPage,
  updatePageBlocks,
  updatePageMeta,
  setPagePublished,
  deletePage,
} from "./pages.js";
export type {
  PageSummary,
  CreatePageInput,
  UpdatePageMetaInput,
} from "./pages.js";

export { getSiteSettings, saveSiteSettings } from "./settings.js";

export {
  listMedia,
  getPublicUrl,
  uploadImage,
  deleteMedia,
} from "./media.js";
export type { MediaItem, UploadImageInput, UploadBody } from "./media.js";
