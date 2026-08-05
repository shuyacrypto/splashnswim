import type { ComponentType } from "react";
import { Card, buttonClassName } from "./ui.js";
import { FileText, ImageIcon, Clock } from "../icons.js";

export interface HomeScreenStats {
  totalPages: number;
  publishedPages: number;
  totalImages: number;
  lastEdited: { title: string; relativeTime: string } | null;
}

export interface HomeScreenProps {
  businessName: string;
  stats: HomeScreenStats;
  newPageHref: string;
  uploadImagesHref: string;
  broadcastHref: string;
}

export function HomeScreen({
  businessName,
  stats,
  newPageHref,
  uploadImagesHref,
  broadcastHref,
}: HomeScreenProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--admin-text,#0f172a)]">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--admin-muted,#64748b)]">
          Here is how the {businessName} website looks today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FileText}
          value={String(stats.totalPages)}
          label={`Pages, ${stats.publishedPages} published`}
        />
        <StatCard icon={ImageIcon} value={String(stats.totalImages)} label="Images in your library" />
        <StatCard
          icon={Clock}
          value={stats.lastEdited ? stats.lastEdited.relativeTime : "No edits yet"}
          label={stats.lastEdited ? `Last edit: ${stats.lastEdited.title}` : "Nothing edited yet"}
        />
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href={newPageHref} className={buttonClassName("primary")}>
            New page
          </a>
          <a href={uploadImagesHref} className={buttonClassName("secondary")}>
            Upload images
          </a>
          <a href={broadcastHref} className={buttonClassName("secondary")}>
            Send broadcast
          </a>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[var(--admin-bg,#f8fafc)] p-2.5">
          <Icon className="h-5 w-5 text-[var(--admin-primary,#0f172a)]" />
        </div>
        <div>
          <div className="text-lg font-bold text-[var(--admin-text,#0f172a)]">{value}</div>
          <div className="text-xs text-[var(--admin-muted,#64748b)]">{label}</div>
        </div>
      </div>
    </Card>
  );
}
