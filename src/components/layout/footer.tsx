import Link from "next/link";

const groups = [
  {
    title: "Client care",
    links: [
      ["Contact", "/contact"],
      ["FAQ", "/faq"],
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
    ],
  },
  {
    title: "About",
    links: [
      ["Our story", "/about"],
      ["Privacy", "/privacy"],
      ["Account", "/account"],
      ["Wishlist", "/wishlist"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-off-white px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em]">ÉLAN</Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-charcoal">
            Premium womenswear shaped around movement, quiet confidence, and considered form.
          </p>
          <p className="mt-8 text-xs text-charcoal/60">Tunis, Tunisia · Prices in TND</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="eyebrow">{group.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link className="hover:underline" href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 border-t border-border pt-6 text-[10px] uppercase tracking-[0.14em] text-charcoal/55 sm:flex-row sm:justify-between">
        <span>© 2026 Élan. Concept storefront.</span>
        <span>English · TND</span>
      </div>
    </footer>
  );
}
