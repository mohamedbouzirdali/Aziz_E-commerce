import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { getAuthContext, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Catégories" };

const notices: Record<string, string> = {
  created: "Catégorie créée.",
  updated: "Catégorie mise à jour.",
  deleted: "Catégorie supprimée.",
  "validation-failed": "Vérifiez le nom, le slug et la position.",
  "slug-exists": "Ce slug de catégorie existe déjà.",
  "save-failed": "La catégorie n’a pas pu être enregistrée.",
  "delete-failed": "La catégorie n’a pas pu être supprimée.",
  "in-use": "Déplacez les produits de cette catégorie avant suppression.",
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const auth = await getAuthContext();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, slug, name, description, position, is_active")
    .order("position");

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Découverte</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Catégories
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Gérez les chemins principaux qui aident les clientes à parcourir le
          catalogue.
        </p>
      </header>
      {params.notice && notices[params.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {notices[params.notice]}
        </p>
      )}
      <div className="mt-8">
        {error ? (
          <p className="border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
            Les catégories sont indisponibles pour le moment.
          </p>
        ) : (
          <TaxonomyManager
            kind="category"
            rows={categories ?? []}
            canDelete={Boolean(auth?.roles.includes("admin"))}
          />
        )}
      </div>
    </div>
  );
}
