import Link from "next/link";

const groups = [
  {
    title: "Boutique",
    links: [
      ["Nouveautés", "/shop?sort=newest"],
      ["Meilleures ventes", "/shop?availability=best-seller"],
      ["Leggings", "/shop?category=bottoms"],
      ["Brassières", "/shop?category=tops"],
      ["Hauts", "/shop?category=tops"],
      ["Ensembles", "/shop?category=sets"],
      ["Vestes & extérieur", "/shop?category=tailoring"],
      ["Accessoires", "/shop?category=accessories"],
    ],
  },
  {
    title: "Collections",
    links: [
      ["Collection essentielle", "/shop?collection=everyday-edit"],
      ["Collection Sculpt", "/shop?collection=new-form"],
      ["Collection Flow", "/shop?collection=after-dark"],
      ["Collection Repos", "/boxes"],
    ],
  },
  {
    title: "Univers",
    links: [
      ["Journal", "/about"],
      ["Bien-être", "/about"],
      ["Guides d’entraînement", "/faq"],
      ["Recettes", "/contact"],
    ],
  },
  {
    title: "À propos",
    links: [
      ["Notre histoire", "/about"],
      ["Durabilité", "/about"],
      ["Carrières", "/contact"],
    ],
  },
  {
    title: "Aide",
    links: [
      ["Nous contacter", "/contact"],
      ["FAQ", "/faq"],
      ["Livraison", "/shipping"],
      ["Retours", "/returns"],
      ["Guide des tailles", "/faq"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#fbf8f2] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1.3fr_2.7fr] lg:gap-16">
        <div className="max-w-sm">
          <Link href="/" className="font-serif text-[2.35rem] leading-none tracking-[0.02em]">
            evoflex
          </Link>
          <p className="mt-5 text-sm leading-7 text-black/66">
            Des vêtements premium pour les femmes qui cultivent une vie de
            confiance, d’équilibre et de discipline.
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
                  <li key={`${group.title}-${label}`}>
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
        <span>© 2024 evoflex. Tous droits réservés.</span>
        <div className="flex gap-5">
          <Link href="/privacy" className="transition-colors hover:text-black">
            Politique de confidentialité
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-black">
            Conditions d’utilisation
          </Link>
        </div>
      </div>
    </footer>
  );
}
