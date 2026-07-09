import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Clientes" };

export default function AdminCustomersPage() {
  return (
    <AdminSectionPage
      eyebrow="Service client · Bientôt"
      title="Clientes"
      description="Cette section servira à accompagner les comptes clientes avec uniquement les informations nécessaires au support."
      capabilities={[
        "Rechercher une cliente avec un identifiant sûr",
        "Voir l’état du compte et les consentements",
        "Préparer les futures adresses et commandes",
        "Séparer les rôles équipe des profils clientes",
      ]}
      note="Cette page reste volontairement limitée tant que les commandes persistantes ne sont pas actives."
    />
  );
}
