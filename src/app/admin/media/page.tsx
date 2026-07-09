import type { Metadata } from "next";
import Image from "next/image";
import {
  deleteMediaAssetAction,
  updateMediaAssetAction,
} from "@/app/admin/media/actions";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Images" };

const notices: Record<string, string> = {
  updated: "Texte alternatif mis à jour.",
  deleted: "Image supprimée.",
  "deleted-storage-cleanup-failed":
    "Les métadonnées ont été supprimées, mais le nettoyage du stockage doit être relancé.",
  "validation-failed": "Le texte alternatif doit contenir au moins trois caractères.",
  "update-failed": "L’image n’a pas pu être mise à jour.",
  "asset-in-use": "Retirez d’abord cette image des produits et sections d’accueil.",
  "delete-failed": "L’image n’a pas pu être supprimée.",
};

function formatBytes(bytes: number | null) {
  if (bytes === null) return "Taille inconnue";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const auth = await requireStaff();
  const query = await searchParams;
  const supabase = await createClient();
  const [
    { data: assets, error },
    { data: productUsage },
    { data: homepageUsage },
  ] = await Promise.all([
    supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("product_media")
      .select("media_asset_id")
      .not("media_asset_id", "is", null),
    supabase
      .from("homepage_section_items")
      .select("media_asset_id")
      .not("media_asset_id", "is", null),
  ]);

  const usage = new Map<string, number>();
  [...(productUsage ?? []), ...(homepageUsage ?? [])].forEach((record) => {
    if (record.media_asset_id) {
      usage.set(
        record.media_asset_id,
        (usage.get(record.media_asset_id) ?? 0) + 1,
      );
    }
  });

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Bibliothèque visuelle</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Images
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Importez les visuels, gardez des descriptions accessibles et vérifiez
          où chaque image est utilisée avant suppression.
        </p>
      </header>

      {query.notice && notices[query.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {notices[query.notice]}
        </p>
      )}

      <div className="mt-8">
        <MediaUploader />
      </div>

      {error ? (
        <p className="mt-8 border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
          Les images sont indisponibles pour le moment.
        </p>
      ) : (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Bibliothèque</p>
              <h2 className="mt-3 font-serif text-4xl">Images disponibles</h2>
            </div>
            <p className="text-xs text-charcoal">
              {assets?.length ?? 0} images
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(assets ?? []).map((asset) => {
              const publicUrl = supabase.storage
                .from(asset.bucket)
                .getPublicUrl(asset.object_path).data.publicUrl;
              const referenceCount = usage.get(asset.id) ?? 0;

              return (
                <article
                  key={asset.id}
                  id={`asset-${asset.id}`}
                  className="overflow-hidden border border-border bg-white"
                >
                  <div className="relative aspect-[4/5] bg-off-white">
                    <Image
                      src={publicUrl}
                      alt={asset.alt_text}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="break-all text-[9px] uppercase leading-5 tracking-[0.12em] text-charcoal">
                      {asset.object_path}
                    </p>
                    <p className="mt-3 text-xs text-charcoal">
                      {asset.width && asset.height
                        ? `${asset.width} × ${asset.height}`
                        : "Dimensions indisponibles"}{" "}
                      · {formatBytes(asset.file_size_bytes)} ·{" "}
                      {referenceCount} utilisation{referenceCount > 1 ? "s" : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="border border-border bg-off-white px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em]">
                        {referenceCount > 0 ? "Utilisée" : "Non utilisée"}
                      </span>
                    </div>

                    <form action={updateMediaAssetAction} className="mt-5">
                      <input type="hidden" name="id" value={asset.id} />
                      <label
                        htmlFor={`${asset.id}-alt`}
                        className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                      >
                        Texte alternatif
                      </label>
                      <textarea
                        id={`${asset.id}-alt`}
                        name="altText"
                        required
                        minLength={3}
                        defaultValue={asset.alt_text}
                        className="mt-2 min-h-20 w-full border border-border px-3 py-2 text-sm leading-6 outline-none focus:border-black"
                      />
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <Button type="submit" variant="secondary">
                          Enregistrer le texte
                        </Button>
                        {auth.roles.includes("admin") && (
                          <Button
                            type="submit"
                            formAction={deleteMediaAssetAction}
                            variant="text"
                            disabled={referenceCount > 0}
                            title={
                              referenceCount > 0
                                ? "Retirez d’abord toutes les utilisations produit et accueil"
                                : undefined
                            }
                            className="text-red-800"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>

          {!assets?.length && (
            <div className="mt-6 border border-border bg-white p-10 text-center">
              <p className="font-serif text-3xl">Aucune image importée</p>
              <p className="mt-3 text-xs text-charcoal">
                La première image apparaîtra ici après import.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
