import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <AdminSectionPage
      eyebrow="Catalog"
      title="Products"
      description="Create and maintain merchandising records separately from their sellable color and size variants."
      capabilities={[
        "Draft, publish, and archive products",
        "Generate option combinations and SKUs",
        "Manage pricing, details, fit, and care",
        "Assign collections, badges, and product media",
      ]}
      note="The route is protected and schema-aware. The next CRUD pass will add validated product forms and transactional variant generation."
    />
  );
}
