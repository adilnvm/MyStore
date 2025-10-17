// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Box, Heading, Flex, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import AdminProductList from "./AdminProductList";
import storeLogo from "../../assets/storelogo.png"; // Adjust path if needed

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50">
      {/* NEW HEADER FLEX CONTAINER */}
      <Box maxW="1200px" mx="auto" p={6}>
        <Flex align="center" justify="space-between" mb={6}>
          {/* 1. Logo and Link (Left) */}
          <Link to="/">
            <img
              src={storeLogo}
              alt="Store"
              style={{ height: "40px", width: "auto" }}
            />
          </Link>

          {/* 2. Admin Dashboard Heading (Center) */}
          <Heading size="lg" flexGrow={1} textAlign="center">
            Admin Dashboard
          </Heading>

          {/* 3. Add Product Button (Right) */}
          <IconButton
            colorScheme="red"
            aria-label="Add product"
            icon={<AddIcon />}
            size="lg"
            onClick={() => navigate("/admin/products/add")}
            borderRadius="full"
            title="Add product"
          />
        </Flex>

        <AdminProductList />
      </Box>
    </Box>
  );
}