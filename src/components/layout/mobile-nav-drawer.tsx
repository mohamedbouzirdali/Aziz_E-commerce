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
              aria-label="Fermer la navigation"
              className="fixed inset-0 z-40 bg-black/35 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              ref={dialog.dialogRef}
              id="mobile-navigation"
              aria-label="Navigation mobile"
              role="dialog"
              aria-modal="true"
              className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[82vw] max-w-[320px] flex-col bg-white shadow-[12px_0_40px_rgba(0,0,0,0.12)] lg:hidden"
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
                <span className="font-serif text-xl tracking-[0.06em]">evoflex</span>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center text-2xl transition-opacity hover:opacity-50"
                  onClick={close}
                  aria-label="Fermer le menu"
                >
                  ×
                </button>
              </div>
              <nav
                aria-label="Navigation mobile principale"
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
              >
                <div className="space-y-1">
                  <Link className="mobile-sidebar-link" href="/shop?sort=newest" onClick={close}>
                    Nouveautés
                  </Link>
                  <button
                    type="button"
                    className="mobile-sidebar-link"
                    onClick={() => setShopOpen((value) => !value)}
                    aria-expanded={shopOpen}
                    aria-controls="mobile-shop-links"
                  >
                    <span>Boutique</span>
                    <span className="text-base font-normal" aria-hidden>{shopOpen ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {shopOpen && (
                      <motion.div
                        id="mobile-shop-links"
                        className="overflow-hidden"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="ml-3 border-l border-border py-1 pl-4">
                          <Link className="mobile-sidebar-subLink font-semibold" href="/shop" onClick={close}>
                            Tous les produits
                          </Link>
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              className="mobile-sidebar-subLink"
                              href={`/shop?category=${category.slug}`}
                              onClick={close}
                            >
                              {category.name}
                            </Link>
                          ))}
                          <p className="pb-1 pt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                            Collections
                          </p>
                          {collections.map((collection) => (
                            <Link
                              key={collection.id}
                              className="mobile-sidebar-subLink"
                              href={`/shop?collection=${collection.slug}`}
                              onClick={close}
                            >
                              {collection.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Link className="mobile-sidebar-link" href="/boxes" onClick={close}>
                    Coffrets
                  </Link>
                  <Link className="mobile-sidebar-link" href="/shop?availability=best-seller" onClick={close}>
                    Meilleures ventes
                  </Link>
                  <Link className="mobile-sidebar-link" href="/about" onClick={close}>
                    À propos
                  </Link>
                </div>
                <div className="mt-8 border-t border-border pt-4">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                    Compte
                  </p>
                  <Link className="mobile-sidebar-utility" href="/account" onClick={close}>Mon compte</Link>
                  <Link className="mobile-sidebar-utility" href="/wishlist" onClick={close}>
                    Envies <span className="text-charcoal/50">({wishlistCount})</span>
                  </Link>
                  <Link className="mobile-sidebar-utility" href="/search" onClick={close}>Recherche</Link>
                  <button
                    type="button"
                    className="mobile-sidebar-utility"
                    onClick={() => {
                      close();
                      setCartOpen(true);
                    }}
                  >
                    <span>Panier</span>
                    <span className="text-charcoal/50">({cartCount})</span>
                  </button>
                </div>
              </nav>
              <div className="shrink-0 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <p className="text-[9px] uppercase tracking-[0.14em] text-charcoal/50">
                  Livraison dans toute la Tunisie
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
