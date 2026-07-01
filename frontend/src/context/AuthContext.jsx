import { useCallback, useMemo, useState } from "react";
import api from "../api/axios.jsx";
import { AuthContext } from "./authContextValue.jsx";

const storageKey = "belletny_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem(storageKey, JSON.stringify(nextUser));
  }, []);

  const login = useCallback(async (credentials) => {
  setLoading(true);
  setError("");

  try {
    console.log("Login request:", credentials);

    const response = await api.post("/auth/login", credentials);

    console.log("Login successful:", response.data);

    persistUser(response.data);
    return response.data;
  } catch (err) {
    console.error("Login error:", err);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response:", err.response.data);
    }

    const message = err.response?.data?.message || "Login failed";
    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
}, [persistUser]);


  const register = useCallback(async (payload) => {
  setLoading(true);
  setError("");

  try {
    const { data } = await api.post("/auth/register", payload);

    // not logging the user in automatically
    return data;
  } catch (err) {
    const message = err.response?.data?.message || "Registration failed";
    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
}, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(storageKey);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.isAdmin),
      loading,
      error,
      login,
      register,
      logout,
    }),
    [error, loading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
