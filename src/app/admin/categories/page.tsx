import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <AdminSectionPage
      eyebrow="Discovery"
      title="Categories"
      description="Control the primary browsing paths customers use to understand and compare the catalog."
      capabilities={[
        "Create and rename category records",
        "Set descriptions and editorial labels",
        "Reorder storefront navigation",
        "Activate or temporarily hide categories",
      ]}
      note="Categories remain stable references for product filters, URLs, and homepage discovery tiles."
    />
  );
}
