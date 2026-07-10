import type { Block, Page, SiteSettings } from "@swim-engine/engine-contracts";
import type { PageSummary, MediaItem } from "@swim-engine/engine-cms";

export type { Block, Page, SiteSettings, PageSummary, MediaItem };

/** Metadata edited on the page editor screen. */
export interface PageMetaInput {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

export interface PagesScreenProps {
  pages: PageSummary[];
  /** Builds the link to a page's editor, given its id. */
  editHref: (id: string) => string;
  onCreatePage: (input: { slug: string; title: string }) => Promise<void>;
  onTogglePublished: (id: string, published: boolean) => Promise<void>;
  onDeletePage: (id: string) => Promise<void>;
}

export interface PageEditorScreenProps {
  page: Page;
  backHref: string;
  onSaveBlocks: (blocks: Block[]) => Promise<void>;
  onSaveMeta: (meta: PageMetaInput) => Promise<void>;
  onTogglePublished: (published: boolean) => Promise<void>;
}

export interface SettingsScreenProps {
  settings: SiteSettings | null;
  onSave: (settings: SiteSettings) => Promise<void>;
}

export interface MediaScreenProps {
  items: MediaItem[];
  /** The public web address for a stored file, for use in image blocks. */
  publicUrl: (storagePath: string) => string;
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
