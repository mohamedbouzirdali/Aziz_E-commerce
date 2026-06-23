"use client";

import Link from "next/link";
import { useCommerce } from "@/components/providers/commerce-provider";
import { DesktopMegaMenu } from "./desktop-mega-menu";
import { MobileNavDrawer } from "./mobile-nav-drawer";

export function Header() {
  const { wishlistCount, cartCount, setCartOpen } = useCommerce();

  return (
    <header className="sticky top-0 z-[60] border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-2 px-3 min-[390px]:grid-cols-[2.75rem_minmax(0,1fr)_auto] min-[390px]:px-5 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:px-8 lg:hidden">
        <div className="flex h-full items-center">
          <MobileNavDrawer />
        </div>
        <Link
          href="/"
          aria-label="Accueil evoflex"
          className="truncate text-center font-serif text-[0.95rem] tracking-[0.06em] min-[390px]:text-[1.15rem] sm:text-xl"
        >
          evoflex
        </Link>
        <nav className="flex items-center justify-end gap-0.5" aria-label="Navigation utilitaire">
          <Link
            href="/search"
            aria-label="Recherche"
            className="flex size-10 items-center justify-center text-base transition-colors hover:text-charcoal/70"
          >
            <span aria-hidden>⌕</span>
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Panier (${cartCount})`}
            className="flex min-h-10 items-center px-1.5 py-3 text-[10px] uppercase tracking-[0.12em] transition-colors hover:text-charcoal/70"
          >
            Panier ({cartCount})
          </button>
        </nav>
      </div>

      <div className="relative mx-auto hidden h-16 max-w-[1600px] items-center justify-between px-3 min-[390px]:px-5 sm:px-8 lg:flex lg:h-[72px] lg:px-12">
        <div className="flex h-full items-center">
          <nav className="hidden h-full items-center lg:flex" aria-label="Navigation principale">
            <Link className="px-4 text-xs uppercase tracking-[0.15em]" href="/shop?sort=newest">Nouveautés</Link>
            <DesktopMegaMenu />
            <Link className="px-4 text-xs uppercase tracking-[0.15em]" href="/boxes">Coffrets</Link>
          </nav>
        </div>
        <Link href="/" aria-label="Accueil evoflex" className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.06em]">
          evoflex
        </Link>
        <nav className="flex items-center" aria-label="Navigation utilitaire">
          <Link href="/search" aria-label="Recherche" className="flex size-10 items-center justify-center text-base sm:px-3">
            <span aria-hidden>⌕</span>
          </Link>
          <Link href="/account" className="hidden px-3 py-3 text-[10px] uppercase tracking-[0.12em] sm:block">Compte</Link>
          <Link href="/wishlist" className="hidden px-3 py-3 text-[10px] uppercase tracking-[0.12em] sm:block">
            Envies ({wishlistCount})
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Panier (${cartCount})`}
            className="flex min-h-10 items-center px-3 py-3 text-[10px] uppercase tracking-[0.12em]"
          >
            Panier ({cartCount})
          </button>
        </nav>
      </div>
    </header>
  );
}
