"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

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
