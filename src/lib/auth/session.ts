import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { Enums } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

type AppRole = Enums<"app_role">;

export type AuthContext = {
  userId: string;
  email: string | null;
  roles: AppRole[];
  isStaff: boolean;
  roleLookupAvailable: boolean;
};

export const getAuthContext = cache(async (): Promise<AuthContext | null> => {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims.sub) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const { data: roleRows, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roles = roleError ? [] : roleRows.map((row) => row.role);

  return {
    userId,
    email: claimsData.claims.email ?? null,
    roles,
    isStaff: roles.includes("editor") || roles.includes("admin"),
    roleLookupAvailable: !roleError,
  };
});

export async function requireStaff() {
  const auth = await getAuthContext();

  if (!auth) {
    redirect("/account?mode=sign-in&next=/admin&notice=sign-in-required");
  }

  if (!auth.roleLookupAvailable) {
    redirect("/account?notice=admin-not-configured");
  }

  if (!auth.isStaff) {
    redirect("/account?notice=staff-required");
  }

  return auth;
}

export async function requireAdmin() {
  const auth = await requireStaff();

  if (!auth.roles.includes("admin")) {
    redirect("/admin?notice=admin-required");
  }

  return auth;
}
