"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AdminActionState } from "@/lib/admin/forms";
import { requireStaff } from "@/lib/auth/session";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function values(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function saveProductAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireStaff();

  const id = value(formData, "id");
  const name = value(formData, "name");
  const slug = value(formData, "slug").toLowerCase();
  const description = value(formData, "description");
  const price = Number(value(formData, "basePriceTnd"));
  const colorCodes = values(formData, "colorCodes");
  const sizeCodes = values(formData, "sizeCodes");
  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) {
    fieldErrors.name = "Enter a product name.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug = "Use lowercase letters, numbers, and hyphens.";
  }

  if (description.length < 10) {
    fieldErrors.description = "Enter at least 10 characters.";
  }

  if (!Number.isFinite(price) || price < 0) {
    fieldErrors.basePriceTnd = "Enter a valid TND price.";
  }

  if (!colorCodes.length) {
    fieldErrors.colorCodes = "Choose at least one color.";
  }

  if (!sizeCodes.length) {
    fieldErrors.sizeCodes = "Choose at least one size.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors };
  }

  const payload: Json = {
    id: id || null,
    slug,
    name,
    short_description: value(formData, "shortDescription") || null,
    description,
    category_id: value(formData, "categoryId") || null,
    status: value(formData, "status") || "draft",
    base_price_tnd: price,
    badges: value(formData, "badges")
      .split(",")
      .map((badge) => badge.trim())
      .filter(Boolean),
    is_new: checked(formData, "isNew"),
    is_best_seller: checked(formData, "isBestSeller"),
    image_ratio: value(formData, "imageRatio") || "portrait",
    details: value(formData, "details") || null,
    composition: value(formData, "composition") || null,
    fit: value(formData, "fit") || null,
    care: value(formData, "care") || null,
    delivery_note: value(formData, "deliveryNote") || null,
    returns_note: value(formData, "returnsNote") || null,
    seo_title: value(formData, "seoTitle") || null,
    seo_description: value(formData, "seoDescription") || null,
    collection_ids: values(formData, "collectionIds"),
    color_codes: colorCodes,
    size_codes: sizeCodes,
  };

  const supabase = await createClient();
  const { data: productId, error } = await supabase.rpc("admin_save_product", {
    payload,
  });

  if (error || !productId) {
    const duplicateSlug = error?.code === "23505";
    return {
      status: "error",
      message: duplicateSlug
        ? "That product slug is already in use."
        : "The product could not be saved. Review the fields and try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect(`/admin/products/${productId}?saved=1`);
}

export async function archiveProductAction(formData: FormData) {
  const auth = await requireStaff();
  const productId = value(formData, "id");

  if (!productId) {
    redirect("/admin/products?notice=product-not-found");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      status: "archived",
      updated_by: auth.userId,
    })
    .eq("id", productId);

  if (error) {
    redirect(`/admin/products/${productId}?notice=archive-failed`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products?notice=product-archived");
}
