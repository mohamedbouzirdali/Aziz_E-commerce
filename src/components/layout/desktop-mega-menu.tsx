"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, collections } from "@/data";

export function DesktopMegaMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div
      ref={menuRef}
      className="hidden h-full items-center lg:flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="desktop-shop-menu"
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        className="h-full px-4 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-off-white"
      >
        Boutique
      </button>
      <div
        id="desktop-shop-menu"
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full z-40 border-y border-border bg-white transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[0.75fr_1fr_0.8fr_1fr] gap-12 px-12 py-10">
          <div>
            <p className="eyebrow">À la une</p>
            <ul className="mt-5 space-y-3">
              <li><Link className="nav-link font-medium" href="/shop?sort=newest" onClick={close}>Nouveautés</Link></li>
              <li><Link className="nav-link font-medium" href="/shop?availability=best-seller" onClick={close}>Meilleures ventes</Link></li>
              <li><Link className="nav-link" href="/shop?collection=everyday-edit" onClick={close}>Édit quotidien</Link></li>
              <li><Link className="nav-link" href="/boxes" onClick={close}>Capsules assorties</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Par catégorie</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link className="nav-link" href="/shop" onClick={close}>Voir tout</Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link className="nav-link" href={`/shop?category=${category.slug}`} onClick={close}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Collections</p>
            <ul className="mt-5 space-y-3">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <Link className="nav-link" href={`/shop?collection=${collection.slug}`} onClick={close}>
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-off-white p-6">
            <p className="eyebrow">Composer la silhouette</p>
            <h3 className="mt-3 font-serif text-3xl">L’édit capsule</h3>
            <p className="mt-3 text-sm leading-6 text-charcoal">
              Des silhouettes complètes, avec choix des tailles et avantage réfléchi.
            </p>
            <Link className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.16em] underline" href="/boxes" onClick={close}>
              Explorer les coffrets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
