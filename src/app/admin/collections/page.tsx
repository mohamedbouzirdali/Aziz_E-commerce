import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { getAuthContext, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Collections" };

const notices: Record<string, string> = {
  created: "Collection créée.",
  updated: "Collection mise à jour.",
  deleted: "Collection supprimée.",
  "validation-failed": "Vérifiez le nom, le slug et la position.",
  "slug-exists": "Ce slug de collection existe déjà.",
  "save-failed": "La collection n’a pas pu être enregistrée.",
  "delete-failed": "La collection n’a pas pu être supprimée.",
  "in-use": "Retirez les produits de cette collection avant suppression.",
};

export default async function AdminCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const auth = await getAuthContext();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: collections, error } = await supabase
    .from("collections")
    .select("id, slug, name, description, position, is_active")
    .order("position");

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Merchandising</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Collections
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Créez des regroupements éditoriaux sans dupliquer les données produit.
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
            Les collections sont indisponibles pour le moment.
          </p>
        ) : (
          <TaxonomyManager
            kind="collection"
            rows={collections ?? []}
            canDelete={Boolean(auth?.roles.includes("admin"))}
          />
        )}
      </div>
    </div>
  );
}
