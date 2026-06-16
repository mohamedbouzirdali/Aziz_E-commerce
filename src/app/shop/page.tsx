import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/shop-experience";
import { ProductSkeletonGrid } from "@/components/loaders";

export const metadata: Metadata = {
  title: "Shop Activewear",
  description: "Shop premium activewear, lifestyle essentials, and elevated daily pieces in TND.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Activewear | evoflex",
    description: "Explore premium activewear, lifestyle essentials, and elevated daily pieces.",
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
