import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";
import { FullPageLoader } from "@/components/loaders";

export const metadata: Metadata = {
  title: "Search",
  description: "Search evoflex activewear and lifestyle pieces by product, category, collection, or color.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<FullPageLoader label="Finding your pieces" fullScreen={false} />}>
      <SearchExperience />
    </Suspense>
  );
}
