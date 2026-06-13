import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Media" };

export default function AdminMediaPage() {
  return (
    <AdminSectionPage
      eyebrow="Asset library"
      title="Media"
      description="Upload optimized fashion imagery to the catalog bucket and manage its accessible metadata and references."
      capabilities={[
        "Upload AVIF, JPEG, PNG, and WebP assets",
        "Require meaningful alt text",
        "Inspect dimensions and file size",
        "Track product and homepage usage",
      ]}
      note="Uploads are restricted to editor and admin roles, with a 10 MiB file limit and explicit MIME allowlist."
    />
  );
}
