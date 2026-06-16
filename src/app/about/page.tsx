import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez l’approche d’evoflex autour d’un vestiaire sport premium, d’un art de vivre intentionnel et d’une polyvalence durable.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Notre regard"
      title="Des vêtements pensés pour une vraie vie."
      description="Cet espace présentera l’approche de la marque autour du vestiaire féminin contemporain, des proportions justes et d’une versatilité durable."
    />
  );
}
