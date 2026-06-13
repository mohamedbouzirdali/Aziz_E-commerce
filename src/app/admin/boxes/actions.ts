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

function values(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function saveBoxAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireStaff();

  const id = value(formData, "id");
  const name = value(formData, "name");
  const slug = value(formData, "slug").toLowerCase();
  const description = value(formData, "description");
  const occasion = value(formData, "occasion");
  const individualTotal = Number(value(formData, "individualTotalPriceTnd"));
  const boxPrice = Number(value(formData, "boxPriceTnd"));
  const position = Number(value(formData, "position"));
  const productIds = values(formData, "productIds");
  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) fieldErrors.name = "Enter a box name.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug = "Use lowercase letters, numbers, and hyphens.";
  }
  if (description.length < 10) {
    fieldErrors.description = "Enter at least 10 characters.";
  }
  if (occasion.length < 2) fieldErrors.occasion = "Enter an occasion.";
  if (!Number.isFinite(individualTotal) || individualTotal < 0) {
    fieldErrors.individualTotalPriceTnd = "Enter a valid total.";
  }
  if (
    !Number.isFinite(boxPrice) ||
    boxPrice < 0 ||
    boxPrice > individualTotal
  ) {
    fieldErrors.boxPriceTnd =
      "Box price must be positive and no higher than the individual total.";
  }
  if (!Number.isInteger(position) || position < 0) {
    fieldErrors.position = "Enter a valid position.";
  }
  if (!productIds.length) {
    fieldErrors.productIds = "Choose at least one product.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors };
  }

  const payload: Json = {
    id: id || null,
    slug,
    name,
    description,
    occasion,
    status: value(formData, "status") || "draft",
    individual_total_price_tnd: individualTotal,
    box_price_tnd: boxPrice,
    placeholder_image_label:
      value(formData, "placeholderImageLabel") || null,
    position,
    product_ids: productIds,
  };

  const supabase = await createClient();
  const { data: boxId, error } = await supabase.rpc("admin_save_box", {
    payload,
  });

  if (error || !boxId) {
    return {
      status: "error",
      message:
        error?.code === "23505"
          ? "That box slug is already in use."
          : "The box could not be saved. Review the fields and try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/boxes");
  revalidatePath("/boxes");
  revalidatePath("/");
  redirect(`/admin/boxes/${boxId}?saved=1`);
}

export async function archiveBoxAction(formData: FormData) {
  const auth = await requireStaff();
  const id = value(formData, "id");

  if (!id) {
    redirect("/admin/boxes?notice=box-not-found");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("boxes")
    .update({ status: "archived", updated_by: auth.userId })
    .eq("id", id);

  if (error) {
    redirect(`/admin/boxes/${id}?notice=archive-failed`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/boxes");
  revalidatePath("/boxes");
  revalidatePath("/");
  redirect("/admin/boxes?notice=box-archived");
}
