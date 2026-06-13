import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return (
    <AdminSectionPage
      eyebrow="Commerce"
      title="Orders"
      description="The operational home for future checkout, payment, fulfillment, return, and customer-service workflows."
      capabilities={[
        "Review immutable order snapshots",
        "Track payment and fulfillment state",
        "Manage returns without rewriting history",
        "Search by order number and customer",
      ]}
      note="Order persistence is intentionally deferred until cart and checkout contracts are finalized."
    />
  );
}
