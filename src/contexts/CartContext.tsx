import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FoodItem } from '@/data/mock-data';

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: FoodItem) => void;
  removeItem: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const addItem = (foodItem: FoodItem) => {
    if (restaurantId && restaurantId !== foodItem.restaurantId) {
      if (confirm('Adding items from a different restaurant will clear your cart. Continue?')) {
        setItems([{ foodItem, quantity: 1 }]);
        setRestaurantId(foodItem.restaurantId);
      }
      return;
    }

    setRestaurantId(foodItem.restaurantId);
    setItems(prev => {
      const existing = prev.find(i => i.foodItem.id === foodItem.id);
      if (existing) {
        return prev.map(i => i.foodItem.id === foodItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { foodItem, quantity: 1 }];
    });
  };

  const removeItem = (foodItemId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.foodItem.id !== foodItemId);
      if (next.length === 0) setRestaurantId(null);
      return next;
    });
  };

  const updateQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(foodItemId);
    setItems(prev => prev.map(i => i.foodItem.id === foodItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
  };

  const totalAmount = items.reduce((sum, i) => sum + i.foodItem.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, restaurantId, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
