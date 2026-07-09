import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Réglages" };

export default function AdminSettingsPage() {
  return (
    <AdminSectionPage
      eyebrow="Configuration"
      title="Réglages"
      description="Centraliser les réglages publics de la boutique sans exposer de secrets ni de données sensibles."
      capabilities={[
        "Modifier les textes de livraison et retours",
        "Gérer la navigation et les messages de service",
        "Configurer des seuils opérationnels",
        "Séparer les réglages publics des secrets serveur",
      ]}
      note="Les identifiants sensibles restent dans les variables serveur et ne seront jamais éditables ici."
    />
  );
}
