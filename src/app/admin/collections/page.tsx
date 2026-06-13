import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { getAuthContext, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Collections" };

const notices: Record<string, string> = {
  created: "Collection created.",
  updated: "Collection updated.",
  deleted: "Collection deleted.",
  "validation-failed": "Review the name, slug, and position.",
  "slug-exists": "That collection slug already exists.",
  "save-failed": "The collection could not be saved.",
  "delete-failed": "The collection could not be deleted.",
  "in-use": "Remove products from this collection before deleting it.",
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
          Build editorial groupings that can span categories without duplicating
          product data.
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
            Collections are unavailable until the hosted migration is applied.
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
