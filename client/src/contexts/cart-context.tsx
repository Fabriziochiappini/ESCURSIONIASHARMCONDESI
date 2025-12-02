import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Travel } from "@shared/schema";

export interface CartItem {
  travel: Travel;
  quantity: number;
  selectedDate?: string;
  participants: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (travel: Travel, participants?: number, selectedDate?: string) => void;
  removeFromCart: (travelId: number) => void;
  updateQuantity: (travelId: number, quantity: number) => void;
  updateParticipants: (travelId: number, participants: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (travel: Travel, participants: number = 1, selectedDate?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.travel.id === travel.id);
      if (existing) {
        return prev.map((item) =>
          item.travel.id === travel.id
            ? { ...item, quantity: item.quantity + 1, participants: participants || item.participants }
            : item
        );
      }
      return [...prev, { travel, quantity: 1, selectedDate, participants }];
    });
  };

  const removeFromCart = (travelId: number) => {
    setItems((prev) => prev.filter((item) => item.travel.id !== travelId));
  };

  const updateQuantity = (travelId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(travelId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.travel.id === travelId ? { ...item, quantity } : item
      )
    );
  };

  const updateParticipants = (travelId: number, participants: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.travel.id === travelId ? { ...item, participants: Math.max(1, participants) } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = Number(item.travel.price) || 0;
      return total + price * item.participants * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateParticipants,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
