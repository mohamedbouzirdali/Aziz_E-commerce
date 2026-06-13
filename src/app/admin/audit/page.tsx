import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Audit Log" };

export default function AdminAuditPage() {
  return (
    <AdminSectionPage
      eyebrow="Governance"
      title="Audit log"
      description="Review who changed protected catalog, inventory, media, box, and homepage records."
      capabilities={[
        "Filter by actor and table",
        "Inspect before and after values",
        "Trace a specific record history",
        "Restrict log visibility to administrators",
      ]}
      note="Audit rows are written by database triggers and cannot be created directly through the public API."
    />
  );
}
