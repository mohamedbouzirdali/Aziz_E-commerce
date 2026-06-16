import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: "Des réponses sur les tailles evoflex, la livraison en Tunisie, les retours et l’expérience d’achat.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <PlaceholderPage
      eyebrow="Service client"
      title="Questions fréquentes"
      description="Un espace clair pour les informations pratiques dont les clientes ont besoin avant et après l’achat."
    >
      <div className="mx-auto max-w-3xl border-t border-border">
        <Accordion title="Où livrez-vous ?" defaultOpen>
          La MVP est préparée pour une livraison dans toute la Tunisie. Les zones finales, les frais et les délais seront confirmés avant le lancement.
        </Accordion>
        <Accordion title="Comment choisir ma taille ?">
          Les pages produit proposent un accès au guide des tailles et signalent les options indisponibles. Les mesures finales suivront le catalogue produit.
        </Accordion>
        <Accordion title="Puis-je retourner un article ?">
          Le catalogue de démonstration prévoit un délai de retour de 14 jours. Le texte final de la politique dépendra de la validation opérationnelle.
        </Accordion>
      </div>
    </PlaceholderPage>
  );
}
