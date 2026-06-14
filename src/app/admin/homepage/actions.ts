"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const allowedImageMimeTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const maxImageFileSize = 10 * 1024 * 1024;

type ReplaceHomepageImageInput = {
  itemId: string;
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

function sectionPath(sectionId: string, notice: string) {
  return `/admin/homepage/${sectionId}?notice=${notice}`;
}

function revalidateHomepage(sectionId?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/homepage");
  if (sectionId) revalidatePath(`/admin/homepage/${sectionId}`);
}

export async function replaceHomepageItemImageAction(
  input: ReplaceHomepageImageInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const auth = await requireAdmin();
  const expectedPrefix = `catalog/${auth.userId}/`;
  const validDimensions =
    (input.width === null || (Number.isInteger(input.width) && input.width > 0)) &&
    (input.height === null ||
      (Number.isInteger(input.height) && input.height > 0));

  if (
    !/^[0-9a-f-]{36}$/i.test(input.itemId) ||
    !input.objectPath.startsWith(expectedPrefix) ||
    !/^catalog\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:avif|jpe?g|png|webp)$/i.test(
      input.objectPath,
    ) ||
    input.altText.trim().length < 3 ||
    !allowedImageMimeTypes.has(input.mimeType) ||
    !Number.isInteger(input.fileSizeBytes) ||
    input.fileSizeBytes <= 0 ||
    input.fileSizeBytes > maxImageFileSize ||
    !validDimensions
  ) {
    return { ok: false, message: "The selected image or metadata is invalid." };
  }

  const supabase = await createClient();
  const { data: item, error: itemError } = await supabase
    .from("homepage_section_items")
    .select("section_id, media_asset_id")
    .eq("id", input.itemId)
    .maybeSingle();

  if (itemError || !item) {
    return { ok: false, message: "This homepage image placement was not found." };
  }

  const { data: media, error: mediaError } = await supabase
    .from("media_assets")
    .insert({
      bucket: "catalog-media",
      object_path: input.objectPath,
      alt_text: input.altText.trim(),
      width: input.width,
      height: input.height,
      mime_type: input.mimeType,
      file_size_bytes: input.fileSizeBytes,
      created_by: auth.userId,
    })
    .select("id")
    .single();

  if (mediaError || !media) {
    return { ok: false, message: "The uploaded image could not be registered." };
  }

  const { error: updateError } = await supabase
    .from("homepage_section_items")
    .update({
      product_id: null,
      box_id: null,
      media_asset_id: media.id,
      placeholder_label: input.altText.trim(),
    })
    .eq("id", input.itemId);

  if (updateError) {
    await Promise.all([
      supabase.from("media_assets").delete().eq("id", media.id),
      supabase.storage.from("catalog-media").remove([input.objectPath]),
    ]);
    return { ok: false, message: "The homepage placement could not be updated." };
  }

  if (item.media_asset_id) {
    const { data: deletedMedia } = await supabase.rpc(
      "admin_delete_media_asset",
      {
        requested_media_asset_id: item.media_asset_id,
      },
    );
    const deleted =
      deletedMedia &&
      typeof deletedMedia === "object" &&
      !Array.isArray(deletedMedia)
        ? (deletedMedia as { bucket?: unknown; objectPath?: unknown })
        : null;

    if (
      typeof deleted?.bucket === "string" &&
      typeof deleted.objectPath === "string"
    ) {
      await supabase.storage
        .from(deleted.bucket)
        .remove([deleted.objectPath]);
    }
  }

  revalidateHomepage(item.section_id);
  return { ok: true };
}

export async function saveHomepageSectionAction(formData: FormData) {
  const auth = await requireStaff();
  const id = value(formData, "id");

  if (!id) {
    redirect("/admin/homepage?notice=section-not-found");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_sections")
    .update({
      eyebrow: value(formData, "eyebrow") || null,
      heading: value(formData, "heading") || null,
      body: value(formData, "body") || null,
      theme:
        value(formData, "theme") === "dark"
          ? "dark"
          : value(formData, "theme") === "off_white"
            ? "off_white"
            : "light",
      is_visible: formData.get("isVisible") === "on",
      updated_by: auth.userId,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/homepage?notice=section-save-failed#section-${id}`);
  }

  revalidateHomepage(id);
  redirect(`/admin/homepage?notice=section-saved#section-${id}`);
}

export async function moveHomepageSectionAction(formData: FormData) {
  await requireStaff();
  const id = value(formData, "id");
  const direction = Number(value(formData, "direction"));

  if (!id || ![-1, 1].includes(direction)) {
    redirect("/admin/homepage?notice=move-failed");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_move_homepage_section", {
    requested_section_id: id,
    requested_direction: direction,
  });

  if (error) {
    redirect("/admin/homepage?notice=move-failed");
  }

  revalidateHomepage();
  redirect(`/admin/homepage?notice=section-moved#section-${id}`);
}

export async function saveHomepageItemAction(formData: FormData) {
  await requireStaff();
  const id = value(formData, "id");
  const sectionId = value(formData, "sectionId");
  const target = value(formData, "target");
  const placeholderLabel = value(formData, "placeholderLabel");
  const ctaHref = value(formData, "ctaHref");
  const [targetType, targetId = ""] = target.split(":");

  if (!sectionId) {
    redirect("/admin/homepage?notice=section-not-found");
  }

  if (
    !["placeholder", "product", "box", "media"].includes(targetType) ||
    (targetType === "placeholder" && !placeholderLabel) ||
    (targetType !== "placeholder" && !targetId) ||
    (ctaHref && !/^\/(?!\/)/.test(ctaHref))
  ) {
    redirect(sectionPath(sectionId, "item-validation-failed"));
  }

  const supabase = await createClient();
  const itemPayload = {
    section_id: sectionId,
    product_id: targetType === "product" ? targetId : null,
    box_id: targetType === "box" ? targetId : null,
    media_asset_id: targetType === "media" ? targetId : null,
    placeholder_label: placeholderLabel || null,
    title_override: value(formData, "titleOverride") || null,
    body_override: value(formData, "bodyOverride") || null,
    cta_label: value(formData, "ctaLabel") || null,
    cta_href: ctaHref || null,
    is_visible: formData.get("isVisible") === "on",
  };

  let error;

  if (id) {
    ({ error } = await supabase
      .from("homepage_section_items")
      .update(itemPayload)
      .eq("id", id));
  } else {
    const { data: lastItem, error: positionError } = await supabase
      .from("homepage_section_items")
      .select("position")
      .eq("section_id", sectionId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (positionError) {
      redirect(sectionPath(sectionId, "item-save-failed"));
    }

    ({ error } = await supabase.from("homepage_section_items").insert({
      ...itemPayload,
      position: (lastItem?.position ?? -1) + 1,
    }));
  }

  if (error) {
    redirect(sectionPath(sectionId, "item-save-failed"));
  }

  revalidateHomepage(sectionId);
  redirect(sectionPath(sectionId, id ? "item-saved" : "item-created"));
}

export async function moveHomepageItemAction(formData: FormData) {
  await requireStaff();
  const id = value(formData, "id");
  const sectionId = value(formData, "sectionId");
  const direction = Number(value(formData, "direction"));

  if (!id || !sectionId || ![-1, 1].includes(direction)) {
    redirect(
      sectionId
        ? sectionPath(sectionId, "item-move-failed")
        : "/admin/homepage?notice=move-failed",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_move_homepage_item", {
    requested_item_id: id,
    requested_direction: direction,
  });

  if (error) {
    redirect(sectionPath(sectionId, "item-move-failed"));
  }

  revalidateHomepage(sectionId);
  redirect(sectionPath(sectionId, "item-moved"));
}

export async function deleteHomepageItemAction(formData: FormData) {
  await requireStaff();
  const id = value(formData, "id");
  const sectionId = value(formData, "sectionId");

  if (!id || !sectionId) {
    redirect("/admin/homepage?notice=item-not-found");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_section_items")
    .delete()
    .eq("id", id)
    .eq("section_id", sectionId);

  if (error) {
    redirect(sectionPath(sectionId, "item-delete-failed"));
  }

  revalidateHomepage(sectionId);
  redirect(sectionPath(sectionId, "item-deleted"));
}
