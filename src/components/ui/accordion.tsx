"use client";

import { useState, type ReactNode } from "react";

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
        <span aria-hidden className="text-lg font-light">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="pb-5 text-sm leading-6 text-charcoal">{children}</div>}
    </div>
  );
}
