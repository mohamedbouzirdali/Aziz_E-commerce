import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Returns",
  description: "Read the Élan returns guidance and sample 14-day return policy.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <PlaceholderPage
      eyebrow="Client care"
      title="Returns"
      description="The mock policy allows returns within 14 days in original condition. Operational rules and the return flow will be finalized later."
    />
  );
}
