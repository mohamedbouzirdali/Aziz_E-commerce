"use client";

import { useState } from "react";

export function QuantitySelector({
  initial = 1,
  onChange,
}: {
  initial?: number;
  onChange?: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(initial);

  return (
    <div className="inline-flex h-11 items-center border border-border">
      <button
        type="button"
        aria-label="Réduire la quantité"
        className="h-full w-11 text-lg"
        onClick={() =>
          setQuantity((value) => {
            const next = Math.max(1, value - 1);
            onChange?.(next);
            return next;
          })
        }
      >
        −
      </button>
      <output className="w-10 text-center text-sm" aria-live="polite">
        {quantity}
      </output>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        className="h-full w-11 text-lg"
        onClick={() =>
          setQuantity((value) => {
            const next = value + 1;
            onChange?.(next);
            return next;
          })
        }
      >
        +
      </button>
    </div>
  );
}
