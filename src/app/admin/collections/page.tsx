import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Collections" };

export default function AdminCollectionsPage() {
  return (
    <AdminSectionPage
      eyebrow="Merchandising"
      title="Collections"
      description="Build editorial groupings that can span categories without duplicating product data."
      capabilities={[
        "Create campaign and evergreen collections",
        "Assign products with controlled ordering",
        "Set collection descriptions",
        "Activate or archive collection visibility",
      ]}
      note="Collections power curated edits such as New Form, After Dark, and Everyday Edit."
    />
  );
}
