import Link from "next/link";
import { AuthForm } from "./auth-form";

export function AccountAccess({
  mode,
  next,
  notice,
}: {
  mode: "sign-in" | "sign-up";
  next: string;
  notice?: string;
}) {
  return (
    <div className="grid border border-border bg-white lg:grid-cols-[0.78fr_1.22fr]">
      <div className="flex min-h-64 flex-col justify-between bg-black p-7 text-white sm:p-10 lg:min-h-[560px]">
        <p className="eyebrow text-white/55">Compte client evoflex</p>
        <div>
          <h2 className="max-w-sm font-serif text-5xl leading-[0.92] sm:text-6xl">
            Votre vestiaire,
            <br />
            <span className="italic">toujours à portée.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
            Enregistrez vos pièces préférées, suivez votre accès et retrouvez un parcours d’achat plus fluide.
          </p>
          <div className="mt-8 grid gap-px bg-white/10">
            {[
              "Liste d’envies conservée entre les sessions",
              "Accès équipe lorsqu’il est attribué",
              "Récupération de mot de passe et connexion sécurisée",
            ].map((item) => (
              <div key={item} className="bg-black/30 px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-white/78">
                {item}
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/shop"
          className="link-underline mt-10 self-start text-[10px] font-semibold uppercase tracking-[0.16em]"
        >
          Poursuivre vos achats
        </Link>
      </div>

      <div className="p-6 sm:p-10 lg:p-14">
        <div className="mb-10 flex border-b border-border">
          <Link
            href={`/account?mode=sign-in&next=${encodeURIComponent(next)}`}
            className={`flex-1 border-b-2 px-3 pb-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] ${
              mode === "sign-in"
                ? "border-black text-black"
                : "border-transparent text-charcoal/55"
            }`}
          >
            Se connecter
          </Link>
          <Link
            href={`/account?mode=sign-up&next=${encodeURIComponent(next)}`}
            className={`flex-1 border-b-2 px-3 pb-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] ${
              mode === "sign-up"
                ? "border-black text-black"
                : "border-transparent text-charcoal/55"
            }`}
          >
            Créer un compte
          </Link>
        </div>

        <div className="mx-auto max-w-md">
          <p className="eyebrow">
            {mode === "sign-in" ? "Heureuse de vous revoir" : "Rejoindre evoflex"}
          </p>
          <h3 className="mt-3 font-serif text-4xl">
            {mode === "sign-in" ? "Se connecter" : "Créer votre compte"}
          </h3>
          <p className="mt-4 text-sm leading-6 text-charcoal">
            {mode === "sign-in"
              ? "Utilisez l’adresse e-mail associée à votre compte."
              : "Votre mot de passe doit comporter une majuscule, une minuscule, un chiffre et au moins 8 caractères."}
          </p>

          {notice && (
            <p className="mt-6 border border-black/15 bg-off-white px-4 py-3 text-xs leading-5 text-charcoal">
              {notice}
            </p>
          )}

          <div className="mt-8 rounded-none border border-border bg-off-white/45 p-5 sm:p-6">
            <AuthForm mode={mode} next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}
