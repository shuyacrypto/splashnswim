import { getPageContent } from "@/lib/get-page-content";
import { PublicShell } from "@/components/PublicShell";
import { PublicBlocks } from "@/components/PublicBlocks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { page, settings } = await getPageContent("home");
  const businessName = settings?.businessName ?? "Draupnir Capital";

  return (
    <PublicShell businessName={businessName}>
      {page ? (
        <PublicBlocks blocks={page.blocks} />
      ) : (
        <p className="text-slate-600">
          No home page found yet. Sign in to the admin area to create one.
        </p>
      )}
    </PublicShell>
  );
}
