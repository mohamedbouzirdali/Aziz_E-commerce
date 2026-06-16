import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Informations sur les délais de livraison evoflex et l’expédition dans toute la Tunisie.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <PlaceholderPage
      eyebrow="Service client"
      title="Livraison"
      description="L’interface communique actuellement une livraison indicative en Tunisie sous 2 à 5 jours ouvrés et la livraison offerte au-delà de 250 TND."
    />
  );
}
