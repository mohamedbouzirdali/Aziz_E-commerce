import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Élan client care for product, sizing, delivery, and order guidance.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      eyebrow="Client care"
      title="Contact us"
      description="A future contact route for order help, product questions, sizing guidance, and general enquiries."
    />
  );
}
