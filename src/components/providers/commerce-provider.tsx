"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

export type CartItem = {
  key: string;
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
};

type CommerceContextValue = {
  wishlistIds: string[];
  cartItems: CartItem[];
  cartOpen: boolean;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addToCart: (product: Product, colorId: string, size: string, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  setCartOpen: (open: boolean) => void;
  wishlistCount: number;
  cartCount: number;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((items) =>
      items.includes(productId)
        ? items.filter((id) => id !== productId)
        : [...items, productId],
    );
  }, []);

  const addToCart = useCallback(
    (product: Product, colorId: string, size: string, quantity = 1) => {
      const key = `${product.id}-${colorId}-${size}`;
      setCartItems((items) => {
        const existing = items.find((item) => item.key === key);
        return existing
          ? items.map((item) =>
              item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
            )
          : [...items, { key, productId: product.id, colorId, size, quantity }];
      });
      setCartOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCartItems((items) => items.filter((item) => item.key !== key));
  }, []);

  const value = useMemo(
    () => ({
      wishlistIds,
      cartItems,
      cartOpen,
      toggleWishlist,
      isWishlisted: (productId: string) => wishlistIds.includes(productId),
      addToCart,
      updateQuantity,
      removeFromCart,
      setCartOpen,
      wishlistCount: wishlistIds.length,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    }),
    [wishlistIds, cartItems, cartOpen, toggleWishlist, addToCart, updateQuantity, removeFromCart],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used inside CommerceProvider");
  return context;
}
