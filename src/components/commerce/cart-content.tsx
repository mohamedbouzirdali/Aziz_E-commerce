"use client";

import Link from "next/link";
import { useState } from "react";
import { useCommerce } from "@/components/providers/commerce-provider";
import { InlineLoader } from "@/components/loaders";
import { PageIntro } from "@/components/sections/page-intro";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { products } from "@/data";
import { formatTnd } from "@/lib/format";

export function CartContent() {
  const { cartItems, updateQuantity, removeFromCart } = useCommerce();
  const [updatingKey, setUpdatingKey] = useState<string>();
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
    <>
      <PageIntro
        eyebrow="Votre sélection"
        title="Panier"
        description="Vérifiez les tailles, couleurs et quantités avant le paiement."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Panier" }]}
      />
      <div className="page-shell py-10 lg:py-16">
        {!cartItems.length ? (
          <EmptyState title="Votre panier est vide" description="Explorez la collection et ajoutez une pièce quand le moment vous semble juste." actionLabel="Découvrir la collection" />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-border border-y border-border">
              {cartItems.map((item) => {
                const product = products.find((candidate) => candidate.id === item.productId);
                if (!product) return null;
                const color = product.colors.find((candidate) => candidate.id === item.colorId);
                return (
                  <li key={item.key} className="grid grid-cols-[82px_1fr] gap-3 py-5 min-[390px]:grid-cols-[110px_1fr] min-[390px]:gap-5 min-[390px]:py-6 sm:grid-cols-[150px_1fr]">
                    <ImagePlaceholder
                      label={color?.imagePlaceholderLabel ?? product.placeholderImageLabel}
                      ratio="portrait"
                      src={color?.imageUrl}
                      alt={color?.imagePlaceholderLabel ?? product.placeholderImageLabel}
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-col gap-2 min-[390px]:flex-row min-[390px]:justify-between min-[390px]:gap-4">
                        <div>
                          <Link href={`/product/${product.slug}`} className="font-serif text-xl min-[390px]:text-2xl">{product.name}</Link>
                          <p className="mt-2 text-xs text-charcoal">{color?.name} · Taille {item.size.toUpperCase()}</p>
                        </div>
                        <p className="text-sm">{formatTnd(product.priceTnd * item.quantity)}</p>
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                        <div className="flex border border-border">
                          <button className="size-9" onClick={() => changeQuantity(item.key, item.quantity - 1)} aria-label="Réduire la quantité">−</button>
                          <span className="flex w-9 items-center justify-center text-xs">{item.quantity}</span>
                          <button className="size-9" onClick={() => changeQuantity(item.key, item.quantity + 1)} aria-label="Augmenter la quantité">+</button>
                        </div>
                        <button className="text-xs underline" onClick={() => removeFromCart(item.key)}>Retirer</button>
                      </div>
                      {updatingKey === item.key && <InlineLoader label="Mise à jour" size="sm" className="mt-3 text-charcoal/60" />}
                    </div>
                  </li>
                );
              })}
            </ul>
            <aside className="h-fit border border-border bg-off-white p-6">
              <h2 className="font-serif text-3xl">Récapitulatif</h2>
              <div className="mt-6 flex justify-between border-t border-border pt-5 text-sm"><span>Sous-total</span><strong>{formatTnd(subtotal)}</strong></div>
              <p className="mt-3 text-xs leading-5 text-charcoal">La livraison sera calculée lorsque le paiement sera connecté.</p>
              <label className="mt-6 block text-[10px] font-semibold uppercase tracking-[0.14em]">
                Code promo
                <div className="mt-2 flex">
                  <input type="text" placeholder="Saisir le code" className="min-h-11 min-w-0 flex-1 border border-border bg-white px-3 text-sm font-normal normal-case tracking-normal" />
                  <button type="button" className="border border-l-0 border-border bg-white px-4 text-[10px] uppercase tracking-[0.12em]">Appliquer</button>
                </div>
              </label>
              <Button disabled className="mt-6 w-full">Paiement indisponible dans la MVP</Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
