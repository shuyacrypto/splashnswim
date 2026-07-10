import type { ReactNode } from "react";

/** A plain page frame for the public site, with a link to the admin area. */
export function PublicShell({
  schoolName,
  children,
}: {
  schoolName: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <span className="font-semibold">{schoolName}</span>
          <a href="/admin" className="text-sm text-slate-500 hover:text-slate-900">
            Admin
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
    </div>
  );
}
