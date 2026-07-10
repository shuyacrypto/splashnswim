import type { Metadata } from "next";
import { getPageBySlug } from "@swim-engine/engine-cms";
import { getPublicClient } from "@/lib/supabase/public";
import { PublicShell } from "@/components/PublicShell";
import { PublicBlocks } from "@/components/PublicBlocks";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(getPublicClient(), "home");
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription,
  };
}

export default async function HomePage() {
  const client = getPublicClient();
  const page = await getPageBySlug(client, "home");
  return (
    <PublicShell>
      {page ? (
        <PublicBlocks blocks={page.blocks} />
      ) : (
        <p className="mx-auto max-w-5xl px-5 py-16 text-navy/70">
          No home page found yet. Sign in to the admin area to create one.
        </p>
      )}
    </PublicShell>
  );
}
