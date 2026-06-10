import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageFade } from "@/components/motion/page-fade";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { CommerceProvider } from "@/components/providers/commerce-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Élan | Contemporary Womenswear",
    template: "%s | Élan",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Élan | Contemporary Womenswear",
    description: siteConfig.description,
    url: "/",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Élan contemporary womenswear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Élan | Contemporary Womenswear",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-clip antialiased">
        <CommerceProvider>
          <JsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteConfig.name,
                url: siteConfig.url,
                logo: absoluteUrl(siteConfig.ogImage),
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.name,
                url: siteConfig.url,
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${absoluteUrl("/search")}?query={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
            ]}
          />
          <AnnouncementBar />
          <Header />
          <main className="flex-1">
            <PageFade>{children}</PageFade>
          </main>
          <Footer />
          <CartDrawer />
          <Analytics />
        </CommerceProvider>
      </body>
    </html>
  );
}
