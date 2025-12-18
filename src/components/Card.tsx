import { ReactNode } from "react";

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {title && <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>}
      <div className="text-slate-800">{children}</div>
    </div>
  );
}
