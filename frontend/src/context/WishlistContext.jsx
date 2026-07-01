import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios.jsx";
import useAuth from "../hooks/useAuth";
import { WishlistContext } from "./wishlistContextValue.jsx";

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return [];
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/wishlist");
      setItems(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load wishlist";
      setError(message);
      setItems([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    setError("");
    const { data } = await api.post(`/wishlist/${productId}`);
    setItems(data);
    return data;
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    setError("");
    const { data } = await api.delete(`/wishlist/${productId}`);
    setItems(data);
    return data;
  }, []);

  const isInWishlist = useCallback(
    (productId) => items.some((product) => product._id === productId),
    [items],
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      }

      return addToWishlist(productId);
    },
    [addToWishlist, isInWishlist, removeFromWishlist],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      loading,
      error,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
    }),
    [
      addToWishlist,
      error,
      fetchWishlist,
      isInWishlist,
      items,
      loading,
      removeFromWishlist,
      toggleWishlist,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
