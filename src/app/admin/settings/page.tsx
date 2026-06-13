import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <AdminSectionPage
      eyebrow="Configuration"
      title="Settings"
      description="Centralize controlled store configuration without placing secrets or unrestricted data in editable content."
      capabilities={[
        "Store delivery and return copy",
        "Manage navigation and service messaging",
        "Configure operational thresholds",
        "Separate public settings from secrets",
      ]}
      note="Sensitive credentials remain in server-only environment variables and will never be editable through this route."
    />
  );
}
