import { notFound } from "next/navigation";
import { getPageBySlug } from "@swim-engine/engine-cms";
import { getPublicClient } from "@/lib/supabase/public";
import { PublicShell } from "@/components/PublicShell";
import { PublicBlocks } from "@/components/PublicBlocks";

export const dynamic = "force-dynamic";

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getPublicClient();
  const page = await getPageBySlug(client, slug);

  if (!page) notFound();

  return (
    <PublicShell>
      <PublicBlocks blocks={page.blocks} />
    </PublicShell>
  );
}
