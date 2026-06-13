import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  return (
    <AdminSectionPage
      eyebrow="Client service"
      title="Customers"
      description="Support customer accounts while exposing only the minimum profile information needed for service."
      capabilities={[
        "Find customer profiles by safe identifiers",
        "Review consent and account state",
        "Support address and order workflows later",
        "Keep staff roles separate from profile data",
      ]}
      note="Customer access will remain tightly scoped; authorization never depends on user-editable profile metadata."
    />
  );
}
