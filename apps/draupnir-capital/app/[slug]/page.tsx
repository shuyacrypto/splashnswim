import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/get-page-content";
import { PublicShell } from "@/components/PublicShell";
import { PublicBlocks } from "@/components/PublicBlocks";

export const dynamic = "force-dynamic";

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { page, settings } = await getPageContent(slug);

  if (!page) notFound();

  return (
    <PublicShell businessName={settings?.businessName ?? "Draupnir Capital"}>
      <PublicBlocks blocks={page.blocks} />
    </PublicShell>
  );
}
