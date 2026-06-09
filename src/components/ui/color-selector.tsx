"use client";

import { useState } from "react";
import type { ProductColor } from "@/lib/types";

export function ColorSelector({
  colors,
  value,
  onChange,
}: {
  colors: ProductColor[];
  value?: string;
  onChange?: (colorId: string) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(colors[0]?.id);
  const selected = value ?? internalSelected;

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Select color">
      {colors.map((color) => {
        return (
          <button
            key={color.id}
            type="button"
            aria-label={color.name}
            aria-pressed={selected === color.id}
            onClick={() => {
              setInternalSelected(color.id);
              onChange?.(color.id);
            }}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className={`size-7 border border-black/20 outline outline-1 outline-offset-2 ${
                selected === color.id ? "outline-black" : "outline-transparent"
              }`}
              style={{ backgroundColor: color.hex }}
            />
            <span>{color.name}</span>
          </button>
        );
      })}
    </div>
  );
}
