import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez le service client evoflex pour toute question produit, taille, livraison ou commande.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      eyebrow="Service client"
      title="Nous contacter"
      description="Une future page de contact pour l’aide commande, les questions produit, les conseils de taille et les demandes générales."
    />
  );
}
