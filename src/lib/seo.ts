export const siteConfig = {
  name: "evoflex",
  url: "https://aziz-e-commerce.vercel.app",
  description:
    "Des pièces premium d’activewear et de lifestyle pour les femmes qui construisent une vie de confiance, d’équilibre et de discipline.",
  ogImage: "/hero.png",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
