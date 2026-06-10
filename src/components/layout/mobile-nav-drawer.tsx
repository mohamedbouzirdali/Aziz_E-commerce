"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import { categories, collections } from "@/data";
import { useDialog } from "@/lib/use-dialog";
import { useCommerce } from "@/components/providers/commerce-provider";

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
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
        onClick={() => {
          setShopOpen(false);
          setOpen(true);
        }}
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
              role="dialog"
              aria-modal="true"
              className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-[360px] flex-col bg-white shadow-[12px_0_40px_rgba(0,0,0,0.12)] lg:hidden"
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <span className="font-serif text-xl tracking-[0.18em]">ÉLAN</span>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center border border-border text-xl transition-colors hover:border-black hover:bg-black hover:text-white"
                  onClick={close}
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>
              <nav
                aria-label="Main mobile navigation"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
              >
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Menu
                </p>
                <div className="border-t border-border">
                  <Link className="mobile-nav-link" href="/shop?sort=newest" onClick={close}>
                    <span>New in</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <button
                    type="button"
                    className="mobile-nav-link"
                    onClick={() => setShopOpen((value) => !value)}
                    aria-expanded={shopOpen}
                    aria-controls="mobile-shop-links"
                  >
                    <span>Shop</span>
                    <span className="text-lg font-normal" aria-hidden>{shopOpen ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {shopOpen && (
                      <motion.div
                        id="mobile-shop-links"
                        className="overflow-hidden border-b border-border bg-off-white"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.24 }}
                      >
                        <Link className="mobile-subnav-link font-semibold" href="/shop" onClick={close}>
                          All products
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            className="mobile-subnav-link"
                            href={`/shop?category=${category.slug}`}
                            onClick={close}
                          >
                            {category.name}
                          </Link>
                        ))}
                        <p className="px-4 pb-1 pt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                          Collections
                        </p>
                        {collections.map((collection) => (
                          <Link
                            key={collection.id}
                            className="mobile-subnav-link"
                            href={`/shop?collection=${collection.slug}`}
                            onClick={close}
                          >
                            {collection.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Link className="mobile-nav-link" href="/boxes" onClick={close}>
                    <span>Boxes</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <Link className="mobile-nav-link" href="/shop?availability=best-seller" onClick={close}>
                    <span>Best sellers</span>
                    <span aria-hidden>→</span>
                  </Link>
                  <Link className="mobile-nav-link" href="/about" onClick={close}>
                    <span>About</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </nav>
              <div className="shrink-0 border-t border-border bg-off-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Your account
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold uppercase tracking-[0.1em]">
                  <Link className="mobile-nav-action" href="/account" onClick={close}>Account</Link>
                  <Link className="mobile-nav-action" href="/wishlist" onClick={close}>Wishlist ({wishlistCount})</Link>
                  <Link className="mobile-nav-action" href="/search" onClick={close}>Search</Link>
                  <button
                    type="button"
                    className="mobile-nav-action text-left"
                    onClick={() => {
                      close();
                      setCartOpen(true);
                    }}
                  >
                    Bag ({cartCount})
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
