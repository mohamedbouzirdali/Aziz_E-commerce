import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Retours",
  description: "Consultez les informations de retour evoflex et la politique indicative de retour sous 14 jours.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <PlaceholderPage
      eyebrow="Service client"
      title="Retours"
      description="La politique de démonstration autorise les retours sous 14 jours dans l’état d’origine. Les règles opérationnelles et le parcours de retour seront finalisés plus tard."
    />
  );
}
