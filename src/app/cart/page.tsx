import type { Metadata } from "next";
import { CartContent } from "@/components/commerce/cart-content";

export const metadata: Metadata = { title: "Shopping Bag" };

export default function CartPage() {
  return <CartContent />;
}
