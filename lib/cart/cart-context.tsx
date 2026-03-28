"use client";

import { createContext, Suspense, useCallback, useContext, useEffect, useState } from "react";
import { CartItem } from "./types";
import { ProgressLoader } from "nextjs-progressloader";

const STORAGE_KEY = "soga-cart";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.skuId === item.skuId);
      if (existing) {
        return prev.map((i) =>
          i.skuId === item.skuId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((skuId: string) => {
    setItems((prev) => prev.filter((i) => i.skuId !== skuId));
  }, []);

  const updateQuantity = useCallback((skuId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.skuId !== skuId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.skuId === skuId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      <Suspense>
        <ProgressLoader color="#000000" showSpinner={false} />
      </Suspense>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
