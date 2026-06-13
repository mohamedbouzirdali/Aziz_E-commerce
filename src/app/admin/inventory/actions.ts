"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

export async function adjustInventoryAction(formData: FormData) {
  await requireAdmin();

  const inventoryLevelId = value(formData, "inventoryLevelId");
  const stockedQuantity = Number(value(formData, "stockedQuantity"));
  const lowStockThreshold = Number(value(formData, "lowStockThreshold"));
  const note = value(formData, "note");

  if (
    !inventoryLevelId ||
    !Number.isInteger(stockedQuantity) ||
    stockedQuantity < 0 ||
    !Number.isInteger(lowStockThreshold) ||
    lowStockThreshold < 0
  ) {
    redirect("/admin/inventory?notice=validation-failed");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_adjust_inventory", {
    requested_inventory_level_id: inventoryLevelId,
    requested_stocked_quantity: stockedQuantity,
    requested_low_stock_threshold: lowStockThreshold,
    requested_note: note,
  });

  if (error) {
    redirect(
      `/admin/inventory?notice=${
        error.message.includes("reserved") ? "below-reserved" : "update-failed"
      }`,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/inventory?notice=updated");
}
