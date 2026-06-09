"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { categories } from "@/data";
import { useDialog } from "@/lib/use-dialog";
import { useCommerce } from "@/components/providers/commerce-provider";

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { cartCount, wishlistCount, setCartOpen } = useCommerce();

  const close = useCallback(() => setOpen(false), []);
  const dialog = useDialog(open, close);

  return (
    <>
      <button
        ref={dialog.triggerRef}
        type="button"
        className="flex min-h-11 min-w-11 items-center gap-2 text-[10px] uppercase tracking-[0.14em] lg:hidden"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        <span className="flex w-4 flex-col gap-1" aria-hidden>
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
        <span className="hidden min-[390px]:inline">Menu</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/35 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              ref={dialog.dialogRef}
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[420px] flex-col bg-white shadow-[12px_0_40px_rgba(0,0,0,0.08)] min-[430px]:w-[90vw] lg:hidden"
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
                <span className="font-serif text-xl tracking-[0.15em]">ÉLAN</span>
                <button type="button" className="size-11 text-2xl" onClick={close} aria-label="Close menu">
                  ×
                </button>
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
                <div className="space-y-1">
                  <Link className="mobile-nav-link" href="/shop?sort=newest" onClick={close}>New in</Link>
                  <Link className="mobile-nav-link" href="/shop" onClick={close}>Shop all</Link>
                  <Link className="mobile-nav-link" href="/boxes" onClick={close}>Boxes</Link>
                  <Link className="mobile-nav-link" href="/shop?bestseller=true" onClick={close}>Best sellers</Link>
                </div>
                <p className="eyebrow mt-10">Categories</p>
                <div className="mt-4 grid grid-cols-2 gap-x-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      className="border-b border-border py-3 text-sm"
                      href={`/shop?category=${category.slug}`}
                      onClick={close}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="grid shrink-0 grid-cols-2 border-t border-border pb-[env(safe-area-inset-bottom)] text-[10px] uppercase tracking-[0.12em]">
                <Link className="border-b border-r border-border p-4" href="/account" onClick={close}>Account</Link>
                <Link className="border-b border-border p-4" href="/wishlist" onClick={close}>Wishlist ({wishlistCount})</Link>
                <Link className="border-r border-border p-4" href="/search" onClick={close}>Search</Link>
                <button
                  type="button"
                  className="p-4 text-left"
                  onClick={() => {
                    close();
                    setCartOpen(true);
                  }}
                >
                  Bag ({cartCount})
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
