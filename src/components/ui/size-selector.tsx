"use client";

import { useState } from "react";

export function SizeSelector({
  sizes,
  unavailableSizes = [],
  value,
  onChange,
}: {
  sizes: string[];
  unavailableSizes?: string[];
  value?: string;
  onChange?: (size: string) => void;
}) {
  const [internalSelected, setInternalSelected] = useState<string>();
  const selected = value ?? internalSelected;

  return (
    <div className="grid grid-cols-5 gap-2" role="group" aria-label="Select size">
      {sizes.map((size) => {
        const unavailable = unavailableSizes.includes(size);
        return (
          <button
            key={size}
            type="button"
            disabled={unavailable}
            aria-pressed={selected === size}
            onClick={() => {
              setInternalSelected(size);
              onChange?.(size);
            }}
            className="min-h-11 border border-border text-xs font-medium uppercase transition-colors aria-pressed:border-black aria-pressed:bg-black aria-pressed:text-white disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-black/25 disabled:line-through"
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
