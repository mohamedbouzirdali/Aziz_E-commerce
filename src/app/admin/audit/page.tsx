import type { Metadata } from "next";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

export const metadata: Metadata = { title: "Journal admin" };

export default function AdminAuditPage() {
  return (
    <AdminSectionPage
      eyebrow="Gouvernance"
      title="Journal admin"
      description="Consulter qui a modifié les données protégées du catalogue, des stocks, des images, des coffrets et de l’accueil."
      capabilities={[
        "Filtrer par personne et par table",
        "Comparer les valeurs avant/après",
        "Suivre l’historique d’un enregistrement",
        "Réserver la visibilité aux administrateurs",
      ]}
      note="Les lignes d’audit sont écrites par la base de données et ne peuvent pas être créées depuis l’interface publique."
    />
  );
}
