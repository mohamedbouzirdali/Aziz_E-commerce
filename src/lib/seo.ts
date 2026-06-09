export const siteConfig = {
  name: "Élan",
  url: "https://elan.tn",
  description:
    "Contemporary women’s fashion in Tunisia, with considered dresses, tailoring, separates, and curated wardrobe boxes.",
  ogImage: "/og-placeholder.svg",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
