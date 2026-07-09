import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Commandes" };

export default function AdminOrdersPage() {
  return (
    <AdminSectionPage
      eyebrow="Commerce · Bientôt"
      title="Commandes"
      description="Cette section regroupera plus tard paiement, préparation, retours et support client."
      capabilities={[
        "Consulter les commandes validées",
        "Suivre paiement et préparation",
        "Gérer les retours sans modifier l’historique",
        "Rechercher par numéro de commande ou cliente",
      ]}
      note="Les commandes sont différées tant que le panier persistant et le paiement ne sont pas finalisés."
    />
  );
}
