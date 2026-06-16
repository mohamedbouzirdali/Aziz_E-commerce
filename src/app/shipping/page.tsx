import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Information about evoflex delivery timing and shipping across Tunisia.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <PlaceholderPage
      eyebrow="Client care"
      title="Shipping"
      description="The interface currently communicates sample Tunisia-wide delivery in 2–5 business days and complimentary delivery over 250 TND."
    />
  );
}
