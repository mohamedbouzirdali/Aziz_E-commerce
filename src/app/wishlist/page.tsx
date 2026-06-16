import type { Metadata } from "next";
import { WishlistContent } from "@/components/commerce/wishlist-content";

export const metadata: Metadata = { title: "Liste d’envies" };

export default function WishlistPage() {
  return <WishlistContent />;
}
