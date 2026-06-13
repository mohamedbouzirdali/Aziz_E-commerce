import type { Metadata } from "next";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { getAuthContext, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Categories" };

const notices: Record<string, string> = {
  created: "Category created.",
  updated: "Category updated.",
  deleted: "Category deleted.",
  "validation-failed": "Review the name, slug, and position.",
  "slug-exists": "That category slug already exists.",
  "save-failed": "The category could not be saved.",
  "delete-failed": "The category could not be deleted.",
  "in-use": "Move products out of this category before deleting it.",
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
        <p className="eyebrow">Discovery</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Categories
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Control the primary browsing paths customers use to understand and
          compare the catalog.
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
            Categories are unavailable until the hosted migration is applied.
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
