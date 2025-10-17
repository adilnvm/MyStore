// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import AdminProtectedRoute from "./components/AdminProtectedRoute";


function App() {
  return (
    <AuthProvider>
      {/* <Navbar /> */}
      <LoginModal />
      
      <Routes>
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={
          <ProtectedRoute><WishlistPage /></ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute><CartPage /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
