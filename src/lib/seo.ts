export const siteConfig = {
  name: "evoflex",
  url: "https://aziz-e-commerce.vercel.app",
  description:
    "Premium activewear and lifestyle pieces for women building a life of confidence, balance, and discipline.",
  ogImage: "/hero.png",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
