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

export const metadata: Metadata = { title: "Media" };

const notices: Record<string, string> = {
  updated: "Alt text updated.",
  deleted: "Media asset deleted.",
  "deleted-storage-cleanup-failed":
    "Metadata was deleted, but Storage cleanup must be retried.",
  "validation-failed": "Alt text must contain at least three characters.",
  "update-failed": "The media asset could not be updated.",
  "asset-in-use": "Remove this asset from products and homepage sections first.",
  "delete-failed": "The media asset could not be deleted.",
};

function formatBytes(bytes: number | null) {
  if (bytes === null) return "Unknown size";
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
        <p className="eyebrow">Asset library</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Media
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Upload optimized catalog imagery, maintain accessible descriptions,
          and inspect every storefront reference before deletion.
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
          Media is unavailable until the hosted migration and Storage bucket are
          applied.
        </p>
      ) : (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Library</p>
              <h2 className="mt-3 font-serif text-4xl">Stored assets</h2>
            </div>
            <p className="text-xs text-charcoal">
              {assets?.length ?? 0} assets
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
                        : "Dimensions unavailable"}{" "}
                      · {formatBytes(asset.file_size_bytes)} ·{" "}
                      {referenceCount} references
                    </p>

                    <form action={updateMediaAssetAction} className="mt-5">
                      <input type="hidden" name="id" value={asset.id} />
                      <label
                        htmlFor={`${asset.id}-alt`}
                        className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                      >
                        Alt text
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
                          Save alt text
                        </Button>
                        {auth.roles.includes("admin") && (
                          <Button
                            type="submit"
                            formAction={deleteMediaAssetAction}
                            variant="text"
                            disabled={referenceCount > 0}
                            title={
                              referenceCount > 0
                                ? "Remove all product and homepage references first"
                                : undefined
                            }
                            className="text-red-800"
                          >
                            Delete asset
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
              <p className="font-serif text-3xl">No images uploaded</p>
              <p className="mt-3 text-xs text-charcoal">
                The first asset will appear here after upload.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
