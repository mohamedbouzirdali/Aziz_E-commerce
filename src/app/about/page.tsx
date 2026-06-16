import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "About",
  description: "Discover evoflex’s approach to premium activewear, intentional living, and lasting versatility.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Our point of view"
      title="Clothes with room for a life."
      description="This space will introduce the brand’s approach to contemporary womenswear, thoughtful proportion, and lasting versatility."
    />
  );
}
