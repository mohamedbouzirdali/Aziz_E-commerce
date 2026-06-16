import type { Metadata } from "next";
import { AuthForm } from "@/components/account/auth-form";
import { PageIntro } from "@/components/sections/page-intro";

export const metadata: Metadata = { title: "Choisir un nouveau mot de passe" };

export default function ResetPasswordPage() {
  return (
    <>
      <PageIntro
        eyebrow="Récupération du compte"
        title="Choisir un nouveau mot de passe"
        description="Utilisez au moins 8 caractères avec une majuscule, une minuscule et un chiffre."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Compte", href: "/account" },
          { label: "Nouveau mot de passe" },
        ]}
      />
      <div className="page-shell py-12 lg:py-20">
        <div className="mx-auto max-w-lg border border-border bg-white p-6 sm:p-10">
          <p className="eyebrow">Mise à jour sécurisée</p>
          <h2 className="mt-3 font-serif text-4xl">Nouveau mot de passe</h2>
          <div className="mt-8">
            <AuthForm mode="reset-password" />
          </div>
        </div>
      </div>
    </>
  );
}
