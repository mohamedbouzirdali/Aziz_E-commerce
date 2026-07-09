import type { Metadata } from "next";
import Link from "next/link";
import {
  moveHomepageSectionAction,
  saveHomepageSectionAction,
} from "@/app/admin/homepage/actions";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Accueil du site" };

const inputClass =
  "mt-2 min-h-11 w-full border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-black";
const labelClass =
  "text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal";

const notices: Record<string, string> = {
  "section-saved": "Section enregistrée.",
  "section-moved": "Ordre des sections mis à jour.",
  "section-save-failed": "La section n’a pas pu être enregistrée.",
  "move-failed": "La section n’a pas pu être déplacée.",
};

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: sections, error } = await supabase
    .from("homepage_sections")
    .select("*, homepage_section_items(count)")
    .order("position");

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Accueil éditorial</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Accueil du site
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Gérez les sections visibles sans dupliquer les produits, coffrets ou
          images. Les changements restent protégés par les droits admin.
        </p>
      </header>

      {params.notice && notices[params.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {notices[params.notice]}
        </p>
      )}

      <section className="mt-8 grid gap-px border border-border bg-border lg:grid-cols-3">
        <div className="bg-white p-5 sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
            Modification rapide
          </p>
          <h2 className="mt-3 font-serif text-3xl">Modifier depuis la page</h2>
          <p className="mt-3 text-xs leading-6 text-charcoal">
            Ouvrez l’accueil en étant connectée admin. Les sections affichent
            un bouton de modification directement sur la page.
          </p>
          <Button href="/" className="mt-5 w-full justify-center">
            Ouvrir l’éditeur public
          </Button>
        </div>
        <div className="bg-white p-5 sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
            Images
          </p>
          <h2 className="mt-3 font-serif text-3xl">Bibliothèque</h2>
          <p className="mt-3 text-xs leading-6 text-charcoal">
            Importez une photo une fois, ajoutez son texte alternatif, puis
            réutilisez-la dans les sections, produits ou coffrets.
          </p>
          <Button href="/admin/media" variant="secondary" className="mt-5 w-full justify-center">
            Importer ou gérer
          </Button>
        </div>
        <div className="bg-off-white p-5 sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
            Structure
          </p>
          <h2 className="mt-3 font-serif text-3xl">Choisir le contenu</h2>
          <p className="mt-3 text-xs leading-6 text-charcoal">
            Utilisez les cartes ci-dessous pour changer les textes, l’ordre et
            les éléments affichés.
          </p>
        </div>
      </section>

      {error ? (
        <p className="mt-8 border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
          Le contenu de l’accueil est indisponible pour le moment.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {(sections ?? []).map((section, index) => (
            <article
              key={section.id}
              id={`section-${section.id}`}
              className="border border-border bg-white"
            >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-charcoal">
                    {String(index + 1).padStart(2, "0")} ·{" "}
                    {section.section_type.replace("_", " ")}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    {section.heading || section.section_key}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="border border-border bg-off-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {section.homepage_section_items[0]?.count ?? 0} items
                    </span>
                    <span className="border border-border bg-off-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {section.is_visible ? "Visible" : "Masquée"}
                    </span>
                    <span className="border border-border bg-off-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {section.theme.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={moveHomepageSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <input type="hidden" name="direction" value="-1" />
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={index === 0}
                      aria-label={`Move ${section.section_key} up`}
                    >
                      Monter
                    </Button>
                  </form>
                  <form action={moveHomepageSectionAction}>
                    <input type="hidden" name="id" value={section.id} />
                    <input type="hidden" name="direction" value="1" />
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={index === sections.length - 1}
                      aria-label={`Move ${section.section_key} down`}
                    >
                      Descendre
                    </Button>
                  </form>
                  <Button href={`/admin/homepage/${section.id}`}>
                    Modifier les éléments
                  </Button>
                </div>
              </div>

              <details className="border-t border-border">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-[10px] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
                  Texte et visibilité
                  <span aria-hidden className="text-base">+</span>
                </summary>
                <form
                  action={saveHomepageSectionAction}
                  className="grid gap-5 border-t border-border p-5 lg:grid-cols-2"
                >
                  <input type="hidden" name="id" value={section.id} />
                  <div>
                    <label className={labelClass} htmlFor={`${section.id}-eyebrow`}>
                      Petit libellé
                    </label>
                    <input
                      id={`${section.id}-eyebrow`}
                      name="eyebrow"
                      defaultValue={section.eyebrow ?? ""}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${section.id}-heading`}>
                      Titre
                    </label>
                    <input
                      id={`${section.id}-heading`}
                      name="heading"
                      defaultValue={section.heading ?? ""}
                      className={inputClass}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className={labelClass} htmlFor={`${section.id}-body`}>
                      Texte
                    </label>
                    <textarea
                      id={`${section.id}-body`}
                      name="body"
                      defaultValue={section.body ?? ""}
                      className="mt-2 min-h-24 w-full border border-border px-3 py-3 text-sm leading-6 outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${section.id}-theme`}>
                      Thème
                    </label>
                    <select
                      id={`${section.id}-theme`}
                      name="theme"
                      defaultValue={section.theme}
                      className={inputClass}
                    >
                      <option value="light">Clair</option>
                      <option value="off_white">Ivoire</option>
                      <option value="dark">Sombre</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <label className="flex min-h-11 items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        name="isVisible"
                        defaultChecked={section.is_visible}
                        className="size-4 accent-black"
                      />
                      Visible sur le site
                    </label>
                    <Button type="submit" variant="secondary" loadingLabel="Enregistrement...">
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </details>
            </article>
          ))}
        </div>
      )}

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-charcoal">
        <p>Les clés de sections sont fixes pour protéger la mise en page.</p>
        <Link href="/" className="link-underline font-semibold text-black">
          Voir le site
        </Link>
      </footer>
    </div>
  );
}
