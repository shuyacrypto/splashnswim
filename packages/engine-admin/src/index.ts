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
export { BroadcastScreen } from "./components/BroadcastScreen.js";
export { HomeScreen } from "./components/HomeScreen.js";
export type { HomeScreenProps, HomeScreenStats } from "./components/HomeScreen.js";
export { BlockEditor } from "./components/BlockEditor.js";

export { BLOCK_LABELS, createBlock } from "./labels.js";

export type {
  PageMetaInput,
  PagesScreenProps,
  PageEditorScreenProps,
  SettingsScreenProps,
  MediaScreenProps,
  BroadcastScreenProps,
  Block,
  Page,
  SiteSettings,
  PageSummary,
  MediaItem,
} from "./types.js";

export { ToastProvider, useToast } from "./components/Toast.js";
export { ConfirmDialog } from "./components/ConfirmDialog.js";
export { EmptyState } from "./components/EmptyState.js";
export { StatusBadge } from "./components/StatusBadge.js";
export type { PageStatus } from "./components/StatusBadge.js";
export { BLOCK_ICONS } from "./labels.js";
export {
  Home,
  FileText,
  ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  UploadCloud,
  Images,
  CalendarClock,
  DollarSign,
  HelpCircle,
  Users,
  Megaphone,
  Phone,
  Clock,
} from "./icons.js";
