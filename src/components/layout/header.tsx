"use client";

import Link from "next/link";
import { useCommerce } from "@/components/providers/commerce-provider";
import { DesktopMegaMenu } from "./desktop-mega-menu";
import { MobileNavDrawer } from "./mobile-nav-drawer";

export function Header() {
  const { wishlistCount, cartCount, setCartOpen } = useCommerce();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-3 min-[390px]:px-5 sm:px-8 lg:h-[72px] lg:px-12">
        <div className="flex h-full items-center">
          <MobileNavDrawer />
          <nav className="hidden h-full items-center lg:flex" aria-label="Primary navigation">
            <Link className="px-4 text-xs uppercase tracking-[0.15em]" href="/shop?sort=newest">New in</Link>
            <DesktopMegaMenu />
            <Link className="px-4 text-xs uppercase tracking-[0.15em]" href="/boxes">Boxes</Link>
          </nav>
        </div>
        <Link href="/" aria-label="Élan home" className="absolute left-1/2 -translate-x-1/2 font-serif text-lg tracking-[0.18em] min-[390px]:text-xl min-[390px]:tracking-[0.22em] sm:text-2xl">
          ÉLAN
        </Link>
        <nav className="flex items-center" aria-label="Utility navigation">
          <Link href="/search" aria-label="Search" className="flex size-10 items-center justify-center text-base min-[390px]:w-auto min-[390px]:px-2 min-[390px]:text-[10px] min-[390px]:uppercase min-[390px]:tracking-[0.12em] sm:px-3">
            <span className="min-[390px]:hidden" aria-hidden>⌕</span>
            <span className="hidden min-[390px]:inline">Search</span>
          </Link>
          <Link href="/account" className="hidden px-3 py-3 text-[10px] uppercase tracking-[0.12em] sm:block">Account</Link>
          <Link href="/wishlist" className="hidden px-3 py-3 text-[10px] uppercase tracking-[0.12em] sm:block">
            Wishlist ({wishlistCount})
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="min-h-10 px-1.5 py-3 text-[9px] uppercase tracking-[0.1em] min-[390px]:px-2 min-[390px]:text-[10px] min-[390px]:tracking-[0.12em] sm:px-3"
          >
            Bag ({cartCount})
          </button>
        </nav>
      </div>
    </header>
  );
}
