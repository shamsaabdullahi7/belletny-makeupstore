import { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./cartContextValue.jsx";
import useAuth from "../hooks/useAuth";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Different storage key for each user
  const storageKey = user
    ? `belletny_cart_${user._id}`
    : "belletny_cart_guest";

  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load the correct cart whenever the logged-in user changes
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setItems(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  const saveItems = useCallback(
    (nextItems) => {
      setItems(nextItems);
      localStorage.setItem(storageKey, JSON.stringify(nextItems));
    },
    [storageKey]
  );

  const addToCart = useCallback(
    (product, quantity = 1) => {
      const image = product.images?.[0]?.url || product.image || "";

      const nextItems = [...items];
      const existing = nextItems.find((item) => item._id === product._id);

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          product.countInStock || 99
        );
      } else {
        nextItems.push({
          _id: product._id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image,
          countInStock: product.countInStock,
          quantity,
        });
      }

      saveItems(nextItems);
      setIsCartOpen(true);
    },
    [items, saveItems]
  );

  const removeFromCart = useCallback(
    (id) => {
      const nextItems = items.filter((item) => item._id !== id);
      saveItems(nextItems);
    },
    [items, saveItems]
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      const nextItems = items.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(Number(quantity), item.countInStock || 99)
              ),
            }
          : item
      );

      saveItems(nextItems);
    },
    [items, saveItems]
  );

  const clearCart = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      items,
      isCartOpen,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
    }),
    [
      items,
      isCartOpen,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};