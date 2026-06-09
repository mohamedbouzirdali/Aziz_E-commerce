import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex border border-black/15 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
      {children}
    </span>
  );
}
