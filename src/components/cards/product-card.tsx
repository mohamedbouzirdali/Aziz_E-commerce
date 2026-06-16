"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { QuickViewModal } from "@/components/commerce/quick-view-modal";
import { useCommerce } from "@/components/providers/commerce-provider";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatTnd } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [previewColorId, setPreviewColorId] = useState(product.defaultColor);
  const quickViewTriggerRef = useRef<HTMLButtonElement>(null);
  const { isWishlisted, toggleWishlist } = useCommerce();
  const reduceMotion = useReducedMotion();
  const saved = isWishlisted(product.id);
  const previewColor =
    product.colors.find((color) => color.id === previewColorId) ?? product.colors[0];
  const categoryLabel = product.category.replaceAll("-", " ");

  return (
    <>
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        className="group min-w-0"
      >
        <div className="relative overflow-hidden border border-black/10 bg-white">
          <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
            <ImagePlaceholder
              label={previewColor.imagePlaceholderLabel}
              ratio="portrait"
              hoverZoom
              src={previewColor.imageUrl}
              alt={previewColor.imagePlaceholderLabel}
              className="bg-[#f3efe7]"
            />
          </Link>
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            {product.badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}
          </div>
          <button
            type="button"
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product.id)}
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-black/10 bg-white/92 text-xl backdrop-blur transition-colors duration-300 hover:bg-black hover:text-white"
          >
            <motion.span
              aria-hidden
              animate={saved && !reduceMotion ? { scale: [1, 1.25, 1] } : undefined}
              whileHover={reduceMotion ? undefined : { scale: 1.14 }}
            >
              {saved ? "♥" : "♡"}
            </motion.span>
          </button>
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-12 grid-cols-2 gap-px bg-black/10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:grid">
            <button
              type="button"
              onClick={(event) => {
                quickViewTriggerRef.current = event.currentTarget;
                setQuickViewOpen(true);
              }}
              className="min-h-11 bg-[#fbf8f2] px-3 text-[10px] font-semibold uppercase tracking-[0.14em] hover:bg-white"
            >
              Quick view
            </button>
            <button
              type="button"
              onClick={(event) => {
                quickViewTriggerRef.current = event.currentTarget;
                setQuickViewOpen(true);
              }}
              className="min-h-11 bg-black px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Add to bag
            </button>
          </div>
        </div>
        <div className="flex min-h-[74px] flex-col gap-2 pt-4 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between min-[380px]:gap-4">
          <div className="min-w-0">
            <h3 className="text-sm font-medium">
              <Link href={`/product/${product.slug}`} className="link-underline">{product.name}</Link>
            </h3>
            <p className="mt-1.5 text-[10px] capitalize tracking-[0.04em] text-charcoal/55">
              {categoryLabel} · {previewColor.name}
            </p>
          </div>
          <p className="shrink-0 text-xs font-medium">{formatTnd(product.priceTnd)}</p>
        </div>
        <p className="line-clamp-2 min-h-10 text-xs leading-5 text-charcoal/58">
          {product.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          {product.colors.map((color) => (
            <button
              key={color.id}
              type="button"
              aria-label={`Preview ${product.name} in ${color.name}`}
              aria-pressed={previewColorId === color.id}
              onMouseEnter={() => setPreviewColorId(color.id)}
              onFocus={() => setPreviewColorId(color.id)}
              onClick={() => setPreviewColorId(color.id)}
              className="size-5 border border-black/20 p-[2px] outline outline-1 outline-offset-2 outline-transparent aria-pressed:outline-black"
            >
              <span className="block size-full" style={{ backgroundColor: color.hex }} />
            </button>
          ))}
          <span className="text-[9px] uppercase tracking-[0.1em] text-charcoal/45">
            {product.colors.length} {product.colors.length === 1 ? "colour" : "colours"}
          </span>
          <button
            type="button"
            onClick={(event) => {
              quickViewTriggerRef.current = event.currentTarget;
              setQuickViewOpen(true);
            }}
            className="ml-auto min-h-9 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] underline sm:hidden"
          >
            Quick view
          </button>
        </div>
      </motion.article>
      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        triggerRef={quickViewTriggerRef}
      />
    </>
  );
}
