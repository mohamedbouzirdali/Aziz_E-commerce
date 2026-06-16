import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/shop-experience";
import { ProductSkeletonGrid } from "@/components/loaders";

export const metadata: Metadata = {
  title: "Boutique sport",
  description: "Découvrez des pièces premium de sport, des essentiels lifestyle et des silhouettes raffinées en TND.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Boutique sport | evoflex",
    description: "Découvrez des pièces premium de sport, des essentiels lifestyle et des silhouettes raffinées.",
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
