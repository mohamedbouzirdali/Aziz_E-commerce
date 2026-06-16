import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Consultez la manière dont evoflex prévoit de traiter la confidentialité, les cookies et les droits des clientes.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      eyebrow="Mentions légales"
      title="Confidentialité"
      description="Une page réservée à la future politique de confidentialité, aux cookies, à la conservation des données et aux droits des clientes."
    />
  );
}
