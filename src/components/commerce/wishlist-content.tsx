"use client";

import { ProductCard } from "@/components/cards/product-card";
import { useCommerce } from "@/components/providers/commerce-provider";
import { PageIntro } from "@/components/sections/page-intro";
import { EmptyState } from "@/components/ui/empty-state";
import { products } from "@/data";

export function WishlistContent() {
  const { wishlistIds } = useCommerce();
  const saved = products.filter((product) => wishlistIds.includes(product.id));

  return (
    <>
      <PageIntro
        eyebrow="Votre sélection enregistrée"
        title="Liste d’envies"
        description="Des pièces gardées de côté pour un autre moment."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Liste d’envies" }]}
      />
      <div className="page-shell py-12 lg:py-16">
        {saved.length ? (
          <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
            {saved.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState
            title="Votre sélection vous attend"
            description="Utilisez le cœur sur un produit pour l’enregistrer ici."
            actionLabel="Découvrir les pièces"
          />
        )}
      </div>
    </>
  );
}
