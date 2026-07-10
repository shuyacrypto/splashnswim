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
  const schoolName = settings?.schoolName ?? "SplashNSwim";

  return (
    <PublicShell schoolName={schoolName}>
      {page ? (
        <PublicBlocks blocks={page.blocks} />
      ) : (
        <p className="mx-auto max-w-5xl px-5 py-16 text-muted">
          No home page found yet. Sign in to the admin area to create one.
        </p>
      )}
    </PublicShell>
  );
}
