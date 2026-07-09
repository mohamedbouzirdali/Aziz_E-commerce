import type { Metadata } from "next";
import Link from "next/link";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { requireStaff } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s | Admin evoflex",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireStaff();

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-off-white">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="bg-black px-5 py-6 text-white sm:px-8 lg:sticky lg:top-0 lg:min-h-screen lg:self-start lg:px-6 lg:py-8">
          <div className="flex items-start justify-between gap-5 lg:block">
            <div>
              <Link
                href="/admin"
                className="font-serif text-2xl tracking-[0.08em]"
              >
                evoflex
              </Link>
              <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-white/45">
                Espace équipe
              </p>
            </div>
            <Link
              href="/"
              className="link-underline text-[9px] font-semibold uppercase tracking-[0.15em] text-white/70 lg:mt-6 lg:inline-block"
            >
              Voir le site
            </Link>
          </div>

          <div className="mt-6 lg:mt-10">
            <AdminNavigation />
          </div>

          <div className="mt-8 border-t border-white/15 pt-5">
            <p className="truncate text-xs text-white/68">
              {auth.email ?? "Compte équipe"}
            </p>
            <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-white/40">
              {auth.roles.join(" · ")}
            </p>
          </div>
        </aside>

        <main className="min-w-0 bg-off-white px-5 py-8 sm:px-8 lg:px-10 lg:py-12 xl:px-14">
          {children}
        </main>
      </div>
    </div>
  );
}
