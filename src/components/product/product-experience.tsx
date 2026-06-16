"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { useCommerce } from "@/components/providers/commerce-provider";
import { Accordion } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ColorSelector } from "@/components/ui/color-selector";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { SizeSelector } from "@/components/ui/size-selector";
import { formatTnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useDialog } from "@/lib/use-dialog";

const views = ["front view", "detail view", "back view", "movement view"];

export function ProductExperience({ product, related }: { product: Product; related: Product[] }) {
  const [colorId, setColorId] = useState(product.defaultColor);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { addToCart, isWishlisted, toggleWishlist } = useCommerce();
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const completeLook = related.slice(0, 3);
  const recommendations = related.slice(3, 7);

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
  };

  return (
    <>
      <div className="page-shell py-5">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]} />
      </div>
      <div className="page-shell grid gap-8 pb-28 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)] lg:gap-14 lg:pb-16">
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 min-[420px]:gap-2">
          {views.map((view, index) => (
            <button
              key={view}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open ${product.name} ${view}`}
              className="group overflow-hidden text-left"
            >
              <ImagePlaceholder
                label={`${product.name} — ${color.name} ${view}`}
                ratio="portrait"
                hoverZoom
                src={color.imageUrl}
                alt={`${product.name} — ${color.name} ${view}`}
              />
              <span className="mt-2 block text-[9px] uppercase tracking-[0.14em] text-charcoal/55">
                {String(index + 1).padStart(2, "0")} · {view}
              </span>
            </button>
          ))}
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{product.collection.replaceAll("-", " ")}</p>
          <div className="mt-3 flex items-start justify-between gap-5">
            <h1 className="font-serif text-3xl leading-tight min-[390px]:text-4xl">{product.name}</h1>
            <motion.button
              type="button"
              className="text-2xl"
              aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={isWishlisted(product.id)}
              onClick={() => toggleWishlist(product.id)}
              whileTap={{ scale: 0.85 }}
            >
              {isWishlisted(product.id) ? "♥" : "♡"}
            </motion.button>
          </div>
          <p className="mt-2 text-sm">{formatTnd(product.priceTnd)}</p>
          <p className="mt-5 text-sm leading-6 text-charcoal">{product.description}</p>
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]">Color · {color.name}</p>
            <ColorSelector colors={product.colors} value={colorId} onChange={setColorId} />
          </div>
          <div className="mt-8">
            <div className="mb-3 flex justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">Size</p>
              <button className="text-xs underline underline-offset-4">Size guide</button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              unavailableSizes={product.unavailableSizes}
              value={size}
              onChange={(nextSize) => {
                setSize(nextSize);
                setError("");
              }}
            />
            {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
          </div>
          <div className="mt-8 flex flex-col gap-3 min-[390px]:flex-row">
            <QuantitySelector onChange={setQuantity} />
            <Button className="flex-1" loading={isAdding} loadingLabel="Adding…" onClick={add}>Add to bag</Button>
          </div>
          <p className="mt-4 border border-border bg-off-white p-4 text-xs leading-5">
            {product.delivery} {product.returns}
          </p>
          <div className="mt-7 border-t border-border">
            <Accordion title="Details" defaultOpen>{product.details}</Accordion>
            <Accordion title="Composition">{product.composition}</Accordion>
            <Accordion title="Fit">{product.fit}</Accordion>
            <Accordion title="Care">{product.care}</Accordion>
            <Accordion title="Delivery & returns">{product.delivery} {product.returns}</Accordion>
          </div>
        </div>
      </div>
      <section className="border-t border-border bg-off-white py-16">
        <div className="page-shell">
          <p className="eyebrow">Styled together</p>
          <h2 className="mt-3 font-serif text-4xl">Complete the Look</h2>
          <div className="mt-8 grid grid-cols-1 gap-y-10 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
            {completeLook.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>
      <section className="border-t border-border py-16">
        <div className="page-shell">
          <p className="eyebrow">More to consider</p>
          <h2 className="mt-3 font-serif text-4xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-1 gap-y-10 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
            {recommendations.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] lg:hidden">
        {error && <p role="alert" className="mb-2 text-xs text-red-700">{error}</p>}
        <div className="flex items-center gap-3">
        <div className="hidden min-w-0 min-[360px]:block">
          <p className="truncate text-xs font-medium">{product.name}</p>
          <p className="mt-1 text-xs text-charcoal">{formatTnd(product.priceTnd)}</p>
        </div>
        <Button className="ml-auto w-full min-[360px]:w-auto min-[360px]:min-w-[150px]" loading={isAdding} loadingLabel="Adding…" onClick={add}>Add to bag</Button>
        </div>
      </div>
      <GalleryLightbox
        product={product}
        colorName={color.name}
        colorImageUrl={color.imageUrl}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}

function GalleryLightbox({
  product,
  colorName,
  colorImageUrl,
  index,
  onIndexChange,
  onClose,
}: {
  product: Product;
  colorName: string;
  colorImageUrl?: string;
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const reduceMotion = useReducedMotion();
  const close = useCallback(onClose, [onClose]);
  const { dialogRef } = useDialog(open, close);

  useEffect(() => {
    if (!open) return;
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onIndexChange(((index ?? 0) + 1) % views.length);
      if (event.key === "ArrowLeft") onIndexChange(((index ?? 0) - 1 + views.length) % views.length);
    };
    document.addEventListener("keydown", handleKeys);
    return () => document.removeEventListener("keydown", handleKeys);
  }, [open, index, onIndexChange]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-2 min-[390px]:p-4 sm:p-8">
          <motion.button className="absolute inset-0" aria-label="Close gallery" onClick={onClose} />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} image gallery`}
            className="relative z-10 w-full max-w-3xl"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <button type="button" onClick={onClose} aria-label="Close gallery" className="absolute right-0 top-0 z-10 size-12 bg-white text-2xl">×</button>
            <ImagePlaceholder
              label={`${product.name} — ${colorName} ${views[index ?? 0]}`}
              ratio="portrait"
              className="mx-auto max-h-[82svh] max-w-[650px]"
              src={colorImageUrl}
              alt={`${product.name} — ${colorName} ${views[index ?? 0]}`}
            />
            <button type="button" aria-label="Previous image" onClick={() => onIndexChange(((index ?? 0) - 1 + views.length) % views.length)} className="absolute left-0 top-1/2 size-10 -translate-y-1/2 bg-white text-lg min-[390px]:size-12 min-[390px]:text-xl">←</button>
            <button type="button" aria-label="Next image" onClick={() => onIndexChange(((index ?? 0) + 1) % views.length)} className="absolute right-0 top-1/2 size-10 -translate-y-1/2 bg-white text-lg min-[390px]:size-12 min-[390px]:text-xl">→</button>
            <p className="mt-3 text-center text-xs uppercase tracking-[0.14em] text-white">{(index ?? 0) + 1} / {views.length}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
