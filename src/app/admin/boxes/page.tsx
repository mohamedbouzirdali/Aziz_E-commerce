import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Boxes" };

export default function AdminBoxesPage() {
  return (
    <AdminSectionPage
      eyebrow="Curated value"
      title="Boxes"
      description="Compose occasion-led product bundles with clear individual totals, box pricing, and savings."
      capabilities={[
        "Create draft and published boxes",
        "Choose products and ordering",
        "Set occasion, copy, and placeholder media",
        "Validate pricing and calculated savings",
      ]}
      note="Boxes reference canonical product records, so product edits remain consistent throughout the storefront."
    />
  );
}
