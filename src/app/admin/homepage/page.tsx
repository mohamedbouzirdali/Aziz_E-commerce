import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Homepage" };

export default function AdminHomepagePage() {
  return (
    <AdminSectionPage
      eyebrow="Editorial storefront"
      title="Homepage"
      description="Control structured sections and featured records without replacing the page with unrestricted page-builder data."
      capabilities={[
        "Edit headings, copy, CTAs, and themes",
        "Choose hero images and featured products",
        "Reorder or hide complete sections",
        "Preview changes before publishing",
      ]}
      note="The CMS references products, boxes, and media; it does not duplicate their canonical commerce data."
    />
  );
}
