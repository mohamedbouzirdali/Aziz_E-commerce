import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";
import { FullPageLoader } from "@/components/loaders";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez les pièces sport et lifestyle evoflex par produit, catégorie, collection ou couleur.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Recherche de vos pièces" fullScreen={false} />}>
      <SearchExperience />
    </Suspense>
  );
}
