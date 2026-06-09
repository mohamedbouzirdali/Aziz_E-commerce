import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Read how Élan plans to handle customer privacy, cookies, and data rights.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Privacy"
      description="A reserved route for the final privacy notice, cookie disclosure, data retention, and customer rights."
    />
  );
}
