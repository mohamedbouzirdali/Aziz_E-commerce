import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/shop-experience";
import { ProductSkeletonGrid } from "@/components/loaders";

export const metadata: Metadata = {
  title: "Shop Women’s Clothing",
  description: "Shop contemporary dresses, tailoring, tops, bottoms, sets, and accessories in TND.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Women’s Clothing | Élan",
    description: "Explore contemporary women’s fashion and curated wardrobe pieces.",
    url: "/shop",
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="page-shell py-12"><ProductSkeletonGrid /></div>}>
      <ShopExperience />
    </Suspense>
  );
}
