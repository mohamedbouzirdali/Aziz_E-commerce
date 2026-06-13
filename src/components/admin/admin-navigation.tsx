"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/boxes", label: "Boxes" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/audit", label: "Audit log" },
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
      <nav className="hidden space-y-1 lg:block" aria-label="Admin navigation">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            className={`flex min-h-10 items-center border-l px-4 text-xs transition-colors ${
              isActive(pathname, link.href)
                ? "border-white bg-white/10 text-white"
                : "border-white/10 text-white/62 hover:border-white/40 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <details className="group border border-white/20 lg:hidden">
        <summary className="flex min-h-12 list-none items-center justify-between px-4 text-[10px] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
          Admin sections
          <span
            aria-hidden
            className="text-base transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <nav
          className="grid border-t border-white/20 sm:grid-cols-2"
          aria-label="Admin navigation"
        >
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`border-b border-white/10 px-4 py-3 text-xs ${
                isActive(pathname, link.href)
                  ? "bg-white text-black"
                  : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </details>
    </>
  );
}
