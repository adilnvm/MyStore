// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute: if user not logged in, navigate to /login with redirectTo state
 * Usage: <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // redirect to /login and preserve where user came from in state
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
