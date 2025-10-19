// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // logged-in user object or null
  const [modalOpen, setModalOpen] = useState(false);
  const redirectRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // load stored user on init
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  }, []);

  // login function: calls backend /api/users/login
  async function login({ username, password }) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Login failed");
      }

      const data = await res.json();
      // backend returns user object on success
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setModalOpen(false);

      // after login, redirect if set
      const r = redirectRef.current;
      if (r) {
        // clear before navigating
        redirectRef.current = null;
        navigate(r, { replace: true });
      }

      return { success: true, user: data };
    } catch (err) {
      return { success: false, message: err.message || "Login failed" };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    // also remove cart/wishlist if you want to reset frontend state
  }

  /**
   * requireAuth(redirectPath)
   * - If user is logged-in: returns true
   * - If not: opens login modal and stores redirect path; returns false
   *
   * Use this to guard UI actions (add to cart, wishlist clicks).
   */
  function requireAuth(redirectPath = "/") {
    if (user) return true;
    redirectRef.current = redirectPath;
    setModalOpen(true);
    return false;
  }

  // direct open login modal (no redirect)
  function openLoginModal(redirectPath = null) {
    if (redirectPath) redirectRef.current = redirectPath;
    setModalOpen(true);
  }

  function closeLoginModal() {
    setModalOpen(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        modalOpen,
        openLoginModal,
        closeLoginModal,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
