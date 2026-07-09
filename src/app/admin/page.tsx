import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const managementAreas = [
  {
    href: "/admin/products",
    title: "Produits",
    description: "Ajouter, publier et corriger les fiches produit.",
  },
  {
    href: "/admin/inventory",
    title: "Stocks",
    description: "Surveiller les ruptures et ajuster les quantités.",
  },
  {
    href: "/admin/homepage",
    title: "Accueil du site",
    description: "Modifier les textes, images et produits mis en avant.",
  },
  {
    href: "/admin/media",
    title: "Images",
    description: "Importer, décrire et réutiliser les visuels.",
  },
];

export default async function AdminDashboardPage() {
  await requireStaff();
  const supabase = await createClient();
  const [
    productsResult,
    variantsResult,
    boxesResult,
    sectionsResult,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("product_variants").select("*", { count: "exact", head: true }),
    supabase.from("boxes").select("*", { count: "exact", head: true }),
    supabase.from("homepage_sections").select("*", { count: "exact", head: true }),
  ]);

  const metrics = [
    ["Produits", productsResult.count, productsResult.error],
    ["Variantes", variantsResult.count, variantsResult.error],
    ["Coffrets", boxesResult.count, boxesResult.error],
    ["Sections visibles", sectionsResult.count, sectionsResult.error],
  ] as const;

  const checks = [
    {
      title: "Images sans texte alternatif",
      description: "Vérifier les visuels récemment importés avant publication.",
      href: "/admin/media",
    },
    {
      title: "Stocks faibles",
      description: "Contrôler les variantes proches de la rupture.",
      href: "/admin/inventory",
    },
    {
      title: "Accueil à jour",
      description: "Changer rapidement les images ou produits mis en avant.",
      href: "/",
    },
  ];

  return (
    <div>
      <header className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
        <p className="eyebrow">Tableau de bord</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Gérer evoflex simplement.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Les actions fréquentes sont regroupées ici: accueil, produits, images
          et stocks. Le reste reste accessible sans surcharger l’interface.
        </p>
        </div>
        <Button href="/" variant="secondary" className="justify-center">
          Voir le site
        </Button>
      </header>

      <section className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, count, error]) => (
          <div key={label} className="bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              {label}
            </p>
            <p className="mt-5 font-serif text-5xl">
              {error ? "—" : (count ?? 0)}
            </p>
            <p className="mt-3 text-xs text-charcoal">
              {error ? "Indisponible pour le moment" : "Total actuel"}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border border-border bg-off-white p-6 sm:p-7">
          <p className="eyebrow">Actions rapides</p>
          <h2 className="mt-3 font-serif text-4xl">Aujourd’hui</h2>
          <p className="mt-4 text-sm leading-7 text-charcoal">
            Accédez directement aux tâches qui changent vraiment la boutique.
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <Button href="/admin/homepage" className="w-full justify-center">
              Modifier l’accueil
            </Button>
            <Button href="/admin/products" variant="secondary" className="w-full justify-center">
              Gérer les produits
            </Button>
            <Button href="/admin/media" variant="ghost" className="w-full justify-between">
              Importer une image
            </Button>
            <Button href="/admin/inventory" variant="ghost" className="w-full justify-between">
              Mettre à jour les stocks
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Opérations</p>
              <h2 className="mt-3 font-serif text-4xl">Espaces principaux</h2>
            </div>
            <p className="hidden max-w-xs text-right text-xs leading-5 text-charcoal sm:block">
              Chaque action sensible vérifie les droits côté serveur.
            </p>
          </div>

          <div className="mt-7 grid gap-px border border-border bg-border md:grid-cols-2">
            {managementAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group bg-white p-6 transition-colors hover:bg-black hover:text-white"
              >
                <div className="flex items-start justify-between gap-5">
                  <h3 className="font-serif text-3xl">{area.title}</h3>
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </div>
                <p className="mt-4 max-w-md text-xs leading-6 text-charcoal transition-colors group-hover:text-white/65">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 border border-border bg-white p-6 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">À vérifier</p>
            <h2 className="mt-3 font-serif text-4xl">Points de contrôle</h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-charcoal">
            Une liste courte pour garder la boutique propre avant publication.
          </p>
        </div>
        <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-3">
          {checks.map((check) => (
            <Link
              key={check.title}
              href={check.href}
              className="group bg-off-white p-5 transition-colors hover:bg-black hover:text-white"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/55 group-hover:text-white/55">
                Contrôle
              </p>
              <h3 className="mt-3 font-serif text-2xl">{check.title}</h3>
              <p className="mt-3 text-xs leading-5 text-charcoal group-hover:text-white/65">
                {check.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
