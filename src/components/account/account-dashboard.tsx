import { signOutAction } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import type { AuthContext } from "@/lib/auth/session";

export function AccountDashboard({ auth }: { auth: AuthContext }) {
  const accountStatus = auth.isStaff ? "Accès équipe" : "Compte client";
  const roleLabels = auth.roles.length ? auth.roles : ["customer"];
  const translatedRoles = roleLabels.map((role) => {
    if (role === "admin") return "Administrateur";
    if (role === "editor") return "Éditeur";
    if (role === "customer") return "Cliente";
    return role;
  });

  return (
    <div className="overflow-hidden border border-border bg-border">
      <section className="grid gap-px lg:grid-cols-[1.3fr_0.7fr]">
        <div className="bg-white p-7 sm:p-10">
          <p className="eyebrow">Connectée</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-4xl sm:text-5xl">Votre compte evoflex</h2>
            <span className="border border-black/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]">
              {accountStatus}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-charcoal">
            {auth.email ?? "Cliente authentifiée"}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {translatedRoles.map((role) => (
              <span
                key={role}
                className="border border-border bg-off-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em]"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
            {[
              ["Liste d’envies", "Retrouvez vos pièces préférées et poursuivez votre sélection."],
              ["Commandes", "L’historique apparaîtra ici lorsque le paiement sera ajouté."],
              ["Livraison", "Les adresses enregistrées seront disponibles dans la prochaine phase."],
              ["Préférences", "Les réglages du profil et des notifications pourront être ajoutés ensuite."],
            ].map(([title, description]) => (
              <div key={title} className="bg-off-white p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                  {title}
                </p>
                <p className="mt-3 text-xs leading-6 text-charcoal">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col justify-between bg-black p-7 text-white sm:p-10">
          <div>
            <p className="eyebrow text-white/50">Actions du compte</p>
            <h3 className="mt-4 font-serif text-3xl leading-tight">
              Accédez rapidement à votre espace client ou aux outils de gestion.
            </h3>
            <div className="mt-8 flex flex-col gap-3">
              <Button href="/wishlist" variant="secondary" className="w-full border-white bg-white text-black before:bg-off-white">
                Voir la liste d’envies
              </Button>
              <Button href="/shop" variant="ghost" className="w-full justify-between text-white">
                Poursuivre vos achats
              </Button>
              {auth.isStaff && (
                <Button href="/admin" variant="ghost" className="w-full justify-between text-white">
                  Ouvrir l’espace admin
                </Button>
              )}
              {auth.isStaff && (
                <>
                  <Button href="/admin/homepage" variant="ghost" className="w-full justify-between text-white">
                    Modifier l’accueil
                  </Button>
                  <Button href="/admin/products" variant="ghost" className="w-full justify-between text-white">
                    Gérer les produits
                  </Button>
                  <Button href="/admin/media" variant="ghost" className="w-full justify-between text-white">
                    Importer des images
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-10">
            {!auth.roleLookupAvailable && (
              <p className="mb-5 border border-white/15 bg-white/5 p-4 text-xs leading-5 text-white/72">
                L’accès au compte est actif. Les rôles équipe seront disponibles après l’application de la migration de base hébergée.
              </p>
            )}

            <form action={signOutAction}>
              <Button
                type="submit"
                variant="secondary"
                loadingLabel="Déconnexion..."
                className="w-full border-white bg-transparent text-white before:bg-white hover:text-black"
              >
                Se déconnecter
              </Button>
            </form>
          </div>
        </aside>
      </section>
    </div>
  );
}
