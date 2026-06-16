import type { Metadata } from "next";
import { CartContent } from "@/components/commerce/cart-content";

export const metadata: Metadata = { title: "Panier" };

export default function CartPage() {
  return <CartContent />;
}
