import { z } from "zod";
import { blockSchema, type Block, type Page } from "@swim-engine/engine-contracts";
import type { Database, EngineDbClient } from "@swim-engine/engine-db";
import { parseOrThrow } from "./validation.js";
import { NotFoundError } from "./errors.js";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type PageUpdate = Database["public"]["Tables"]["pages"]["Update"];

/** A page address: lower-case letters, numbers and single hyphens. */
const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lower-case letters, numbers and hyphens only, for example about-us.",
  );

const titleSchema = z.string().min(1, "A title is required.");
const blocksSchema = z.array(blockSchema);

/** A lightweight page record for list screens (no block content). */
export interface PageSummary {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updatedAt: string;
}

export interface CreatePageInput {
  slug: string;
  title: string;
}

export interface UpdatePageMetaInput {
  title?: string;
  slug?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

function rowToPage(row: PageRow): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    blocks: row.blocks,
    published: row.published,
    updatedAt: row.updated_at,
  };
}

/** All pages, newest first, without their block content. */
export async function listPages(client: EngineDbClient): Promise<PageSummary[]> {
  const { data, error } = await client
    .from("pages")
    .select("id, slug, title, published, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    published: row.published,
    updatedAt: row.updated_at,
  }));
}

/** A single page by its address, or null if there is none. */
export async function getPageBySlug(
  client: EngineDbClient,
  slug: string,
): Promise<Page | null> {
  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToPage(data) : null;
}

/** A single page by its id, or null if there is none. */
export async function getPageById(
  client: EngineDbClient,
  id: string,
): Promise<Page | null> {
  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToPage(data) : null;
}

/** Creates a new, empty, unpublished page. */
export async function createPage(
  client: EngineDbClient,
  input: CreatePageInput,
): Promise<Page> {
  const slug = parseOrThrow(slugSchema, input.slug, "Page address");
  const title = parseOrThrow(titleSchema, input.title, "Page title");
  const { data, error } = await client
    .from("pages")
    .insert({ slug, title })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return rowToPage(data);
}

/**
 * Replaces a page's block content. The blocks are validated against
 * engine-contracts first, so invalid content is rejected before saving.
 */
export async function updatePageBlocks(
  client: EngineDbClient,
  id: string,
  blocks: Block[],
): Promise<Page> {
  const validated = parseOrThrow(blocksSchema, blocks, "Page content");
  const { data, error } = await client
    .from("pages")
    .update({ blocks: validated })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new NotFoundError(`No page found with id ${id}.`);
  return rowToPage(data);
}

/** Updates a page's title, address or metadata. */
export async function updatePageMeta(
  client: EngineDbClient,
  id: string,
  input: UpdatePageMetaInput,
): Promise<Page> {
  const update: PageUpdate = {};
  if (input.title !== undefined) {
    update.title = parseOrThrow(titleSchema, input.title, "Page title");
  }
  if (input.slug !== undefined) {
    update.slug = parseOrThrow(slugSchema, input.slug, "Page address");
  }
  if (input.metaTitle !== undefined) update.meta_title = input.metaTitle;
  if (input.metaDescription !== undefined) {
    update.meta_description = input.metaDescription;
  }

  const { data, error } = await client
    .from("pages")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new NotFoundError(`No page found with id ${id}.`);
  return rowToPage(data);
}

/** Publishes or unpublishes a page. */
export async function setPagePublished(
  client: EngineDbClient,
  id: string,
  published: boolean,
): Promise<Page> {
  const { data, error } = await client
    .from("pages")
    .update({ published })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new NotFoundError(`No page found with id ${id}.`);
  return rowToPage(data);
}

/** Permanently deletes a page. */
export async function deletePage(
  client: EngineDbClient,
  id: string,
): Promise<void> {
  const { error } = await client.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
