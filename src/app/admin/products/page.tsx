import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Products" };

const noticeMessages: Record<string, string> = {
  "product-archived": "The product was archived.",
  "product-not-found": "That product could not be found.",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const supabase = await createClient();
  const params = await searchParams;
  const [{ data: products, error }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, name, base_price_tnd, status, is_new, is_best_seller, category_id, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("categories").select("id, name"),
  ]);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            Products
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
            Manage product identity, publishing, pricing, options, variants, and
            customer-facing details.
          </p>
        </div>
        <Button href="/admin/products/new">New product</Button>
      </header>

      {params.notice && noticeMessages[params.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {noticeMessages[params.notice]}
        </p>
      )}

      {error ? (
        <p className="mt-8 border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
          Products are unavailable until the hosted migration is applied.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-off-white">
                {["Product", "Category", "Status", "Price", "Updated", ""].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.16em]"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-5">
                    <p className="font-serif text-xl">{product.name}</p>
                    <p className="mt-1 text-[10px] text-charcoal/60">
                      /{product.slug}
                    </p>
                  </td>
                  <td className="px-5 py-5 text-xs text-charcoal">
                    {product.category_id
                      ? categoryNames.get(product.category_id) ?? "Unassigned"
                      : "Unassigned"}
                  </td>
                  <td className="px-5 py-5">
                    <span className="border border-black/15 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {product.base_price_tnd.toFixed(3)} TND
                  </td>
                  <td className="px-5 py-5 text-xs text-charcoal">
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                    }).format(new Date(product.updated_at))}
                  </td>
                  <td className="px-5 py-5 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="link-underline text-[10px] font-semibold uppercase tracking-[0.14em]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!products?.length && (
            <div className="p-10 text-center">
              <p className="font-serif text-3xl">No products yet</p>
              <p className="mt-3 text-sm text-charcoal">
                Create the first merchandising record.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
