"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type TaxonomyKind = "category" | "collection";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function kindFrom(formData: FormData): TaxonomyKind {
  return value(formData, "kind") === "collection" ? "collection" : "category";
}

function returnPath(kind: TaxonomyKind, notice: string) {
  const route = kind === "category" ? "categories" : "collections";
  return `/admin/${route}?notice=${notice}`;
}

export async function saveTaxonomyAction(formData: FormData) {
  await requireStaff();

  const kind = kindFrom(formData);
  const id = value(formData, "id");
  const slug = value(formData, "slug").toLowerCase();
  const name = value(formData, "name");
  const description = value(formData, "description");
  const position = Number(value(formData, "position"));
  const isActive = formData.get("isActive") === "on";

  if (
    name.length < 2 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !Number.isInteger(position) ||
    position < 0
  ) {
    redirect(returnPath(kind, "validation-failed"));
  }

  const supabase = await createClient();
  const payload = {
    slug,
    name,
    description: description || null,
    position,
    is_active: isActive,
  };

  const result =
    kind === "category"
      ? id
        ? await supabase.from("categories").update(payload).eq("id", id)
        : await supabase.from("categories").insert(payload)
      : id
        ? await supabase.from("collections").update(payload).eq("id", id)
        : await supabase.from("collections").insert(payload);

  if (result.error) {
    redirect(
      returnPath(
        kind,
        result.error.code === "23505" ? "slug-exists" : "save-failed",
      ),
    );
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${kind === "category" ? "categories" : "collections"}`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect(returnPath(kind, id ? "updated" : "created"));
}

export async function deleteTaxonomyAction(formData: FormData) {
  await requireAdmin();

  const kind = kindFrom(formData);
  const id = value(formData, "id");

  if (!id) {
    redirect(returnPath(kind, "not-found"));
  }

  const supabase = await createClient();

  if (kind === "category") {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (count) {
      redirect(returnPath(kind, "in-use"));
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      redirect(returnPath(kind, "delete-failed"));
    }
  } else {
    const { count } = await supabase
      .from("product_collections")
      .select("*", { count: "exact", head: true })
      .eq("collection_id", id);

    if (count) {
      redirect(returnPath(kind, "in-use"));
    }

    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      redirect(returnPath(kind, "delete-failed"));
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${kind === "category" ? "categories" : "collections"}`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect(returnPath(kind, "deleted"));
}
