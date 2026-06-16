import type { Metadata } from "next";
import { AccountAccess } from "@/components/account/account-access";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { PageIntro } from "@/components/sections/page-intro";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { getAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Compte" };

const noticeMessages: Record<string, string> = {
  "sign-in-required": "Connectez-vous pour accéder à l’espace d’administration.",
  "staff-required": "Ce compte ne dispose pas d’un accès équipe.",
  "admin-not-configured":
    "Les rôles d’administration seront disponibles une fois la migration de la base hébergée appliquée.",
  "confirmation-failed":
    "Ce lien de confirmation est invalide ou expiré. Demandez-en un nouveau.",
  "password-updated": "Votre mot de passe a bien été mis à jour.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    next?: string;
    notice?: string;
  }>;
}) {
  const auth = await getAuthContext();
  const params = await searchParams;
  const mode = params.mode === "sign-up" ? "sign-up" : "sign-in";
  const next = safeRedirectPath(params.next ?? "/account");
  const notice = params.notice ? noticeMessages[params.notice] : undefined;

  return (
    <>
      <PageIntro
      eyebrow="Compte client"
        title={auth ? "Heureuse de vous revoir" : "Votre compte"}
        description={
          auth
            ? "Gérez votre accès evoflex et passez de vos pièces enregistrées aux outils équipe."
            : "Connectez-vous ou créez un compte pour une expérience d’achat plus fluide."
        }
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Compte" }]}
      />
      <div className="page-shell py-12 lg:py-20">
        {auth ? (
          <AccountDashboard auth={auth} />
        ) : (
          <AccountAccess mode={mode} next={next} notice={notice} />
        )}
      </div>
    </>
  );
}
