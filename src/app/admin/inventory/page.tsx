import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Inventory" };

export default function AdminInventoryPage() {
  return (
    <AdminSectionPage
      eyebrow="Stock control"
      title="Inventory"
      description="Manage exact quantities at variant level while the public storefront sees availability without private stock totals."
      capabilities={[
        "Review stock by product, color, and size",
        "Record restocks, returns, and corrections",
        "Set low-stock thresholds",
        "Inspect immutable adjustment history",
      ]}
      note="Exact inventory is admin-protected by RLS and never exposed through anonymous catalog reads."
    />
  );
}
