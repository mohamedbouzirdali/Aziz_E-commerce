"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

type AdminStorefrontContextValue = {
  isAdmin: boolean;
  sectionIds: Record<string, string>;
};

const AdminStorefrontContext = createContext<AdminStorefrontContextValue>({
  isAdmin: false,
  sectionIds: {},
});

export function AdminStorefrontControlsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sectionIds, setSectionIds] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    async function loadAdminControls() {
      if (!hasSupabaseConfig()) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!role || !active) return;

      const { data: sections } = await supabase
        .from("homepage_sections")
        .select("id, section_key");

      if (!active) return;

      setIsAdmin(true);
      setSectionIds(
        Object.fromEntries(
          (sections ?? []).map((section) => [
            section.section_key,
            section.id,
          ]),
        ),
      );
    }

    void loadAdminControls();

    return () => {
      active = false;
    };
  }, []);

  const contextValue = useMemo(
    () => ({ isAdmin, sectionIds }),
    [isAdmin, sectionIds],
  );

  return (
    <AdminStorefrontContext.Provider value={contextValue}>
      {children}
      {isAdmin && (
        <Link
          href="/admin/homepage"
          className="fixed bottom-5 left-5 z-[70] border border-white/25 bg-black px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-colors hover:bg-charcoal"
        >
          Admin · Homepage
        </Link>
      )}
    </AdminStorefrontContext.Provider>
  );
}

export function AdminSectionEditLink({
  sectionKey,
  label = "Edit section",
}: {
  sectionKey: string;
  label?: string;
}) {
  const { isAdmin, sectionIds } = useContext(AdminStorefrontContext);
  const sectionId = sectionIds[sectionKey];

  if (!isAdmin || !sectionId) return null;

  return (
    <Link
      href={`/admin/homepage/${sectionId}`}
      className="absolute right-4 top-4 z-40 border border-white/20 bg-black px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-colors hover:bg-charcoal focus-visible:outline-white sm:right-6 sm:top-6"
    >
      {label}
    </Link>
  );
}
