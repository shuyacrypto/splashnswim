import type { ComponentType, ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--admin-border,#e2e8f0)] bg-[var(--admin-surface,#ffffff)] p-10 text-center">
      <Icon className="h-10 w-10 text-[var(--admin-muted,#64748b)]" />
      <div>
        <p className="text-sm font-semibold text-[var(--admin-text,#0f172a)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--admin-muted,#64748b)]">{description}</p>
      </div>
      {action ?? null}
    </div>
  );
}
