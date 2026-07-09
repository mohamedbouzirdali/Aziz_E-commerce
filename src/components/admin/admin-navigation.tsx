"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminLink = {
  href: string;
  label: string;
  badge?: string;
};

const primaryLinks: AdminLink[] = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/homepage", label: "Accueil du site" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/media", label: "Images" },
  { href: "/admin/inventory", label: "Stocks" },
  { href: "/admin/boxes", label: "Coffrets" },
  { href: "/admin/settings", label: "Réglages" },
];

const secondaryLinks: AdminLink[] = [
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/orders", label: "Commandes", badge: "Bientôt" },
  { href: "/admin/customers", label: "Clientes", badge: "Bientôt" },
  { href: "/admin/audit", label: "Journal admin" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden space-y-1 lg:block" aria-label="Navigation admin">
        {primaryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            className={`flex min-h-11 items-center border-l px-4 text-xs font-medium transition-colors ${
              isActive(pathname, link.href)
                ? "border-white bg-white/10 text-white"
                : "border-white/10 text-white/62 hover:border-white/40 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-5">
          <p className="px-4 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Secondaire
          </p>
          <div className="mt-2 space-y-1">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={`flex min-h-10 items-center justify-between gap-3 border-l px-4 text-[11px] transition-colors ${
                  isActive(pathname, link.href)
                    ? "border-white bg-white/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/35 hover:text-white/85"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="border border-white/15 px-2 py-1 text-[7px] uppercase tracking-[0.12em] text-white/45">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <details className="group border border-white/20 lg:hidden">
        <summary className="flex min-h-12 list-none items-center justify-between px-4 text-[10px] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
          Menu admin
          <span
            aria-hidden
            className="text-base transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <nav
          className="grid border-t border-white/20 sm:grid-cols-2"
          aria-label="Navigation admin"
        >
          {[...primaryLinks, ...secondaryLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-xs ${
                isActive(pathname, link.href)
                  ? "bg-white text-black"
                  : "text-white/70"
              }`}
            >
              <span>{link.label}</span>
              {"badge" in link && link.badge && (
                <span className="text-[7px] uppercase tracking-[0.12em] opacity-60">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </details>
    </>
  );
}
