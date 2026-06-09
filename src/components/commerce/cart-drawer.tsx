"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useCommerce } from "@/components/providers/commerce-provider";
import { InlineLoader } from "@/components/loaders";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { products } from "@/data";
import { formatTnd } from "@/lib/format";
import { useDialog } from "@/lib/use-dialog";

export function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, updateQuantity, removeFromCart } = useCommerce();
  const reduceMotion = useReducedMotion();
  const [updatingKey, setUpdatingKey] = useState<string>();
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  const dialog = useDialog(cartOpen, close);
  const subtotal = cartItems.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return total + (product?.priceTnd ?? 0) * item.quantity;
  }, 0);

  const changeQuantity = (key: string, quantity: number) => {
    setUpdatingKey(key);
    updateQuantity(key, quantity);
    window.setTimeout(() => setUpdatingKey(undefined), 350);
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close shopping bag"
            className="fixed inset-0 z-[70] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            ref={dialog.dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-white"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <h2 className="font-serif text-2xl">Your bag</h2>
              <button type="button" aria-label="Close bag" className="size-10 text-2xl" onClick={() => setCartOpen(false)}>×</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 min-[390px]:p-5">
              {cartItems.length === 0 ? (
                <p className="py-16 text-center text-sm text-charcoal">Your bag is empty.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {cartItems.map((item) => {
                    const product = products.find((candidate) => candidate.id === item.productId);
                    if (!product) return null;
                    const color = product.colors.find((candidate) => candidate.id === item.colorId);
                    return (
                      <li key={item.key} className="grid grid-cols-[76px_1fr] gap-3 py-5 min-[390px]:grid-cols-[92px_1fr] min-[390px]:gap-4">
                        <ImagePlaceholder label={color?.imagePlaceholderLabel ?? product.placeholderImageLabel} ratio="portrait" />
                        <div>
                          <div className="flex flex-col gap-2 min-[390px]:flex-row min-[390px]:justify-between min-[390px]:gap-3">
                            <Link href={`/product/${product.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-medium">{product.name}</Link>
                            <p className="text-xs">{formatTnd(product.priceTnd * item.quantity)}</p>
                          </div>
                          <p className="mt-1 text-xs text-charcoal/60">{color?.name} · {item.size.toUpperCase()}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex border border-border">
                              <button className="size-8" onClick={() => changeQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                              <span className="flex w-8 items-center justify-center text-xs">{item.quantity}</span>
                              <button className="size-8" onClick={() => changeQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity">+</button>
                            </div>
                            <button className="text-xs underline" onClick={() => removeFromCart(item.key)}>Remove</button>
                          </div>
                          {updatingKey === item.key && <InlineLoader label="Updating" size="sm" className="mt-3 text-charcoal/60" />}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="shrink-0 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] min-[390px]:p-5">
              <div className="flex justify-between text-sm"><span>Subtotal</span><strong>{formatTnd(subtotal)}</strong></div>
              <label className="mt-5 block text-[10px] font-semibold uppercase tracking-[0.14em]">
                Promo code
                <div className="mt-2 flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="min-h-11 min-w-0 flex-1 border border-border px-3 text-sm font-normal normal-case tracking-normal outline-none"
                  />
                  <button type="button" className="border border-l-0 border-border px-4 text-[10px] uppercase tracking-[0.12em]">
                    Apply
                  </button>
                </div>
              </label>
              <Button disabled className="mt-5 w-full">Checkout disabled in MVP</Button>
              <button type="button" onClick={() => setCartOpen(false)} className="mt-4 w-full text-xs uppercase tracking-[0.14em] underline">Continue shopping</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
