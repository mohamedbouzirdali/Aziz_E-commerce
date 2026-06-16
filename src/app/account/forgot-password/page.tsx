import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/account/auth-form";
import { PageIntro } from "@/components/sections/page-intro";

export const metadata: Metadata = { title: "Réinitialiser le mot de passe" };

export default function ForgotPasswordPage() {
  return (
    <>
      <PageIntro
        eyebrow="Récupération du compte"
        title="Réinitialiser votre mot de passe"
        description="Saisissez l’e-mail de votre compte et nous vous enverrons un lien de récupération sécurisé."
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Compte", href: "/account" },
          { label: "Réinitialiser le mot de passe" },
        ]}
      />
      <div className="page-shell py-12 lg:py-20">
        <div className="mx-auto max-w-lg border border-border bg-white p-6 sm:p-10">
          <p className="eyebrow">Lien de récupération</p>
          <h2 className="mt-3 font-serif text-4xl">Retrouver votre compte</h2>
          <p className="mt-4 text-sm leading-6 text-charcoal">
            Par confidentialité, la réponse reste la même, que l’adresse e-mail soit enregistrée ou non.
          </p>
          <div className="mt-8">
            <AuthForm mode="forgot-password" />
          </div>
          <Link
            href="/account"
            className="link-underline mt-7 inline-block text-xs text-charcoal"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </>
  );
}
