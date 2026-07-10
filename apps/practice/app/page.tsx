import { getPageBySlug, getSiteSettings } from "@swim-engine/engine-cms";
import { getPublicClient } from "@/lib/supabase/public";
import { PublicShell } from "@/components/PublicShell";
import { PublicBlocks } from "@/components/PublicBlocks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const client = getPublicClient();
  const [page, settings] = await Promise.all([
    getPageBySlug(client, "home"),
    getSiteSettings(client),
  ]);
  const schoolName = settings?.schoolName ?? "Practice School";

  return (
    <PublicShell schoolName={schoolName}>
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
