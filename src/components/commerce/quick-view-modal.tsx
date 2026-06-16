"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useCommerce } from "@/components/providers/commerce-provider";
import { Button } from "@/components/ui/button";
import { ColorSelector } from "@/components/ui/color-selector";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { SizeSelector } from "@/components/ui/size-selector";
import { formatTnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useDialog } from "@/lib/use-dialog";

export function QuickViewModal({
  product,
  open,
  onClose,
  triggerRef,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [colorId, setColorId] = useState(product.defaultColor);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, isWishlisted, toggleWishlist } = useCommerce();
  const reduceMotion = useReducedMotion();
  const close = useCallback(() => onClose(), [onClose]);
  const dialog = useDialog(open, close);
  dialog.triggerRef.current = triggerRef.current;
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];

  const add = async () => {
    if (!size) {
      setError("Select a size before adding to bag.");
      return;
    }
    setError("");
    setIsAdding(true);
    await new Promise((resolve) => window.setTimeout(resolve, 380));
    addToCart(product, colorId, size, quantity);
    setIsAdding(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            aria-label="Close quick view"
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={dialog.dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`quick-view-${product.id}`}
            className="relative z-10 grid max-h-[100svh] w-full max-w-4xl overflow-y-auto overscroll-contain bg-white sm:max-h-[92svh] sm:grid-cols-2"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            <div className="mx-auto w-2/3 pt-4 min-[430px]:w-1/2 sm:w-full sm:pt-0">
              <ImagePlaceholder
                label={color.imagePlaceholderLabel}
                ratio="portrait"
                src={color.imageUrl}
                alt={color.imagePlaceholderLabel}
              />
            </div>
            <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] min-[390px]:p-6 sm:p-8">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute right-4 top-4 flex size-10 items-center justify-center border border-border bg-white text-xl"
              >
                ×
              </button>
              <p className="eyebrow">{product.category}</p>
              <h2 id={`quick-view-${product.id}`} className="mt-3 pr-10 font-serif text-3xl min-[390px]:text-4xl">
                {product.name}
              </h2>
              <p className="mt-2 text-sm">{formatTnd(product.priceTnd)}</p>
              <p className="mt-5 text-sm leading-6 text-charcoal">{product.description}</p>
              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]">Color</p>
                <ColorSelector colors={product.colors} value={colorId} onChange={setColorId} />
              </div>
              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]">Size</p>
                <SizeSelector
                  sizes={product.sizes}
                  unavailableSizes={product.unavailableSizes}
                  value={size}
                  onChange={(nextSize) => {
                    setSize(nextSize);
                    setError("");
                  }}
                />
                {error && <p className="mt-2 text-xs text-red-700" role="alert">{error}</p>}
              </div>
              <div className="mt-7 flex flex-col gap-3 min-[390px]:flex-row">
                <QuantitySelector onChange={setQuantity} />
                <Button className="flex-1" loading={isAdding} loadingLabel="Adding…" onClick={add}>Add to bag</Button>
              </div>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="mt-4 w-full border border-border py-3 text-xs uppercase tracking-[0.14em]"
              >
                {isWishlisted(product.id) ? "Saved to wishlist" : "Add to wishlist"}
              </button>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-charcoal">
                {product.delivery} {product.returns}
              </p>
              <Link href={`/product/${product.slug}`} onClick={onClose} className="link-underline mt-5 inline-block text-xs font-semibold uppercase tracking-[0.14em]">
                View full product details
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
