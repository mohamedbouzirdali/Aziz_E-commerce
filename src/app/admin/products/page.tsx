import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Produits" };

const noticeMessages: Record<string, string> = {
  "product-archived": "Le produit a été archivé.",
  "product-not-found": "Ce produit est introuvable.",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const supabase = await createClient();
  const params = await searchParams;
  const [
    { data: products, error },
    { data: categories },
    { data: productMedia },
  ] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, name, base_price_tnd, status, is_new, is_best_seller, category_id, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("categories").select("id, name"),
    supabase
      .from("product_media")
      .select("product_id, is_primary, position, placeholder_label, media_assets(id, bucket, object_path, alt_text)")
      .order("is_primary", { ascending: false })
      .order("position"),
  ]);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const imageByProduct = new Map(
    (productMedia ?? []).map((media) => [media.product_id, media]),
  );

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            Produits
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
            Gérez les fiches produits, les prix, la publication et les détails
            visibles par les clientes.
          </p>
        </div>
        <Button href="/admin/products/new">Nouveau produit</Button>
      </header>

      {params.notice && noticeMessages[params.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {noticeMessages[params.notice]}
        </p>
      )}

      {error ? (
        <p className="mt-8 border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
          Les produits sont indisponibles pour le moment.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-off-white">
                {["Produit", "Catégorie", "Statut", "Prix", "Mise à jour", ""].map(
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
              {(products ?? []).map((product) => {
                const media = imageByProduct.get(product.id);
                const asset = Array.isArray(media?.media_assets)
                  ? media?.media_assets[0]
                  : media?.media_assets;
                const imageUrl = asset
                  ? supabase.storage.from(asset.bucket).getPublicUrl(asset.object_path).data.publicUrl
                  : null;

                return (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden border border-border bg-off-white">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={asset?.alt_text ?? product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center px-2 text-center text-[7px] uppercase tracking-[0.12em] text-charcoal/45">
                            Sans image
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-xl">{product.name}</p>
                        <p className="mt-1 text-[10px] text-charcoal/60">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-xs text-charcoal">
                    {product.category_id
                      ? categoryNames.get(product.category_id) ?? "Non classé"
                      : "Non classé"}
                  </td>
                  <td className="px-5 py-5">
                    <span className="border border-black/15 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]">
                      {product.status === "active"
                        ? "Publié"
                        : product.status === "archived"
                          ? "Archivé"
                          : "Brouillon"}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {product.base_price_tnd.toFixed(3)} TND
                  </td>
                  <td className="px-5 py-5 text-xs text-charcoal">
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                    }).format(new Date(product.updated_at))}
                  </td>
                  <td className="px-5 py-5 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="link-underline text-[10px] font-semibold uppercase tracking-[0.14em]"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>

          {!products?.length && (
            <div className="p-10 text-center">
              <p className="font-serif text-3xl">Aucun produit pour le moment</p>
              <p className="mt-3 text-sm text-charcoal">
                Créez la première fiche produit pour commencer.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
