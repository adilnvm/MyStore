import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("admin") === "true";
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
