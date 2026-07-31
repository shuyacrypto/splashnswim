export type PageStatus = "published" | "draft";

/** The Published/Draft pill shown on page lists and the page editor. */
export function StatusBadge({ status }: { status: PageStatus }) {
  const isPublished = status === "published";
  return (
    <span
      className={
        isPublished
          ? "inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
          : "inline-flex items-center rounded-full bg-[var(--admin-bg,#f8fafc)] px-2.5 py-0.5 text-xs font-semibold text-[var(--admin-muted,#64748b)]"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
