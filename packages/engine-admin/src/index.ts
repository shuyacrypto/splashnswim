/**
 * engine-admin is the constrained, generic-branded admin panel, provided as a
 * kit of React screens. The screens take their data in as props and hand
 * changes back out through callbacks; the consuming app wires those callbacks
 * to engine-cms (never to the database directly) and provides Supabase auth.
 *
 * The panel is identical for every school and is never restyled per client.
 */

export { AdminShell } from "./components/AdminShell.js";
export type { AdminNavItem } from "./components/AdminShell.js";

export { PagesScreen } from "./components/PagesScreen.js";
export { PageEditorScreen } from "./components/PageEditorScreen.js";
export { SettingsScreen } from "./components/SettingsScreen.js";
export { MediaScreen } from "./components/MediaScreen.js";
export { BlockEditor } from "./components/BlockEditor.js";

export { BLOCK_LABELS, createBlock } from "./labels.js";

export type {
  PageMetaInput,
  PagesScreenProps,
  PageEditorScreenProps,
  SettingsScreenProps,
  MediaScreenProps,
  Block,
  Page,
  SiteSettings,
  PageSummary,
  MediaItem,
} from "./types.js";
