import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Travel, Addon } from "@shared/schema";

export interface SelectedAddon {
  addon: Addon;
  quantity: number;
}

export interface CartItem {
  travel: Travel;
  quantity: number;
  selectedDate?: string;
  participants: number;
  participantNotes?: string;
  selectedAddons?: SelectedAddon[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (travel: Travel, participants?: number, selectedDate?: string, addons?: SelectedAddon[]) => void;
  removeFromCart: (travelId: number) => void;
  updateQuantity: (travelId: number, quantity: number) => void;
  updateParticipants: (travelId: number, participants: number) => void;
  updateParticipantNotes: (travelId: number, notes: string) => void;
  updateAddons: (travelId: number, addons: SelectedAddon[]) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getAddonsTotal: (travelId: number) => number;
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

  const addToCart = (travel: Travel, participants: number = 1, selectedDate?: string, addons?: SelectedAddon[]) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.travel.id === travel.id);
      if (existing) {
        return prev.map((item) =>
          item.travel.id === travel.id
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                participants: participants || item.participants,
                selectedAddons: addons || item.selectedAddons
              }
            : item
        );
      }
      return [...prev, { travel, quantity: 1, selectedDate, participants, selectedAddons: addons }];
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

  const updateParticipantNotes = (travelId: number, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.travel.id === travelId ? { ...item, participantNotes: notes } : item
      )
    );
  };

  const updateAddons = (travelId: number, addons: SelectedAddon[]) => {
    setItems((prev) =>
      prev.map((item) =>
        item.travel.id === travelId ? { ...item, selectedAddons: addons } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getAddonsTotal = (travelId: number) => {
    const item = items.find(i => i.travel.id === travelId);
    if (!item?.selectedAddons) return 0;
    return item.selectedAddons.reduce((total, sa) => {
      return total + (Number(sa.addon.price) || 0) * sa.quantity * item.participants;
    }, 0);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = Number(item.travel.price) || 0;
      const travelTotal = price * item.participants;
      const addonsTotal = (item.selectedAddons || []).reduce((at, sa) => {
        return at + (Number(sa.addon.price) || 0) * sa.quantity * item.participants;
      }, 0);
      return total + travelTotal + addonsTotal;
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
        updateParticipantNotes,
        updateAddons,
        clearCart,
        getTotal,
        getItemCount,
        getAddonsTotal,
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
