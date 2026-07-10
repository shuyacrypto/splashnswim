/**
 * engine-db owns the database: the schema and migrations (in ./supabase),
 * the Row Level Security policies, and the typed client used to reach it.
 *
 * Apps never import the raw Supabase client directly; they go through the
 * engine, which uses the clients created here.
 */

export { createPublicClient, createAdminClient } from "./client.js";
export type { EngineDbClient } from "./client.js";
export type { Database } from "./database.types.js";
