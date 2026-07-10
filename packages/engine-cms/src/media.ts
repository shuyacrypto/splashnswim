import type { Database, EngineDbClient } from "@swim-engine/engine-db";
import { NotFoundError } from "./errors.js";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];

/** The Supabase Storage bucket that holds uploaded images. */
const BUCKET = "media";

/** The kinds of file content the upload accepts. */
export type UploadBody = ArrayBuffer | ArrayBufferView | string;

export interface MediaItem {
  id: string;
  storagePath: string;
  alt: string;
  createdAt: string;
}

export interface UploadImageInput {
  /** Where the file is stored in the bucket, for example "home/hero.jpg". */
  path: string;
  file: UploadBody;
  contentType?: string;
  alt?: string;
}

function rowToMedia(row: MediaRow): MediaItem {
  return {
    id: row.id,
    storagePath: row.storage_path,
    alt: row.alt,
    createdAt: row.created_at,
  };
}

/** All uploaded images, newest first. */
export async function listMedia(client: EngineDbClient): Promise<MediaItem[]> {
  const { data, error } = await client
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToMedia);
}

/** The public web address for a stored file, for use in image blocks. */
export function getPublicUrl(
  client: EngineDbClient,
  storagePath: string,
): string {
  return client.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

/** Uploads an image to storage and records it in the media table. */
export async function uploadImage(
  client: EngineDbClient,
  input: UploadImageInput,
): Promise<MediaItem> {
  const upload = await client.storage
    .from(BUCKET)
    .upload(input.path, input.file, {
      contentType: input.contentType,
      upsert: false,
    });
  if (upload.error) throw new Error(upload.error.message);

  const { data, error } = await client
    .from("media")
    .insert({ storage_path: input.path, alt: input.alt ?? "" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return rowToMedia(data);
}

/** Deletes an image: first the stored file, then its record. */
export async function deleteMedia(
  client: EngineDbClient,
  id: string,
): Promise<void> {
  const found = await client
    .from("media")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (found.error) throw new Error(found.error.message);
  if (!found.data) throw new NotFoundError(`No image found with id ${id}.`);

  const removal = await client.storage
    .from(BUCKET)
    .remove([found.data.storage_path]);
  if (removal.error) throw new Error(removal.error.message);

  const { error } = await client.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
