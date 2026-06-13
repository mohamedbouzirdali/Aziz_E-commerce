"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const allowedMimeTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const maxFileSize = 10 * 1024 * 1024;

type RegisterMediaInput = {
  objectPath: string;
  altText: string;
  width: number | null;
  height: number | null;
  mimeType: string;
  fileSizeBytes: number;
};

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function revalidateMedia() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/media");
}

export async function registerMediaAssetAction(
  input: RegisterMediaInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const auth = await requireStaff();
  const expectedPrefix = `catalog/${auth.userId}/`;
  const validDimensions =
    (input.width === null || (Number.isInteger(input.width) && input.width > 0)) &&
    (input.height === null ||
      (Number.isInteger(input.height) && input.height > 0));

  if (
    !input.objectPath.startsWith(expectedPrefix) ||
    !/^catalog\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:avif|jpe?g|png|webp)$/i.test(
      input.objectPath,
    ) ||
    input.altText.trim().length < 3 ||
    !allowedMimeTypes.has(input.mimeType) ||
    !Number.isInteger(input.fileSizeBytes) ||
    input.fileSizeBytes <= 0 ||
    input.fileSizeBytes > maxFileSize ||
    !validDimensions
  ) {
    return { ok: false, message: "The uploaded image metadata is invalid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("media_assets").insert({
    bucket: "catalog-media",
    object_path: input.objectPath,
    alt_text: input.altText.trim(),
    width: input.width,
    height: input.height,
    mime_type: input.mimeType,
    file_size_bytes: input.fileSizeBytes,
    created_by: auth.userId,
  });

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "This image is already registered."
          : "The image metadata could not be saved.",
    };
  }

  revalidateMedia();
  return { ok: true };
}

export async function updateMediaAssetAction(formData: FormData) {
  await requireStaff();
  const id = value(formData, "id");
  const altText = value(formData, "altText");

  if (!id || altText.length < 3) {
    redirect("/admin/media?notice=validation-failed");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("media_assets")
    .update({ alt_text: altText })
    .eq("id", id);

  if (error) {
    redirect("/admin/media?notice=update-failed");
  }

  revalidateMedia();
  redirect(`/admin/media?notice=updated#asset-${id}`);
}

export async function deleteMediaAssetAction(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");

  if (!id) {
    redirect("/admin/media?notice=asset-not-found");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_delete_media_asset", {
    requested_media_asset_id: id,
  });

  if (error) {
    redirect(
      `/admin/media?notice=${error.code === "23503" ? "asset-in-use" : "delete-failed"}`,
    );
  }

  const deleted =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as { bucket?: unknown; objectPath?: unknown })
      : null;

  if (
    !deleted ||
    typeof deleted.bucket !== "string" ||
    typeof deleted.objectPath !== "string"
  ) {
    redirect("/admin/media?notice=delete-failed");
  }

  const { error: storageError } = await supabase.storage
    .from(deleted.bucket)
    .remove([deleted.objectPath]);

  revalidateMedia();
  redirect(
    `/admin/media?notice=${
      storageError ? "deleted-storage-cleanup-failed" : "deleted"
    }`,
  );
}
