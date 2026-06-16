import Link from "next/link";

const groups = [
  {
    title: "Shop",
    links: [
      ["New arrivals", "/shop?sort=newest"],
      ["Best sellers", "/shop?availability=best-seller"],
      ["Dresses", "/shop?category=dresses"],
      ["Tailoring", "/shop?category=tailoring"],
      ["Tops", "/shop?category=tops"],
      ["Accessories", "/shop?category=accessories"],
    ],
  },
  {
    title: "Collections",
    links: [
      ["New Form", "/shop?collection=new-form"],
      ["Everyday Edit", "/shop?collection=everyday-edit"],
      ["After Dark", "/shop?collection=after-dark"],
      ["Boxes", "/boxes"],
    ],
  },
  {
    title: "Lifestyle",
    links: [
      ["About", "/about"],
      ["FAQ", "/faq"],
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Contact us", "/contact"],
      ["Privacy", "/privacy"],
      ["Account", "/account"],
      ["Wishlist", "/wishlist"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#fbf8f2] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1.3fr_2.7fr] lg:gap-16">
        <div className="max-w-sm">
          <Link href="/" className="font-serif text-[2.35rem] leading-none tracking-[0.02em]">
            ÉLAN
          </Link>
          <p className="mt-5 text-sm leading-7 text-black/66">
            Premium womenswear for women building a lifestyle of confidence,
            balance, and discipline.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-black/68">
            <span>Instagram</span>
            <span>Pinterest</span>
            <span>TikTok</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/52">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-black/72">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link className="transition-colors hover:text-black" href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1600px] flex-col gap-3 border-t border-black/10 pt-5 text-[11px] text-black/46 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 ÉLAN. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/privacy" className="transition-colors hover:text-black">
            Privacy Policy
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-black">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
