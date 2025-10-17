// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Input,
  IconButton,
  Button,
  Text,
  Avatar,
  Badge,
  useBreakpointValue,
  Tooltip,
  Icon,
} from "@chakra-ui/react";

import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaStore,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

export default function Navbar({ onSearch, onCategorySelect }) {
  const navigate = useNavigate();
  const { user, logout, requireAuth, openLoginModal } = useAuth();
  const { cart, wishlist } = useStore();
  const wishlistCount = wishlist?.length || 0;
  const cartCount = cart?.length || 0;
  const isMobile = useBreakpointValue({ base: true, md: false });

  // categories (includes "All")
  const categories = ["All", "Electronics", "Clothing", "Accessories"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  function handleCategoryClick(cat) {
    setSelectedCategory(cat);
    // user-facing API expects empty string for "all" in many controllers
    if (onCategorySelect) onCategorySelect(cat === "All" ? "" : cat);
  }

  function handleWishlistClick() {
    if (!requireAuth("/wishlist")) return;
    navigate("/wishlist");
  }

  function handleCartClick() {
    if (!requireAuth("/cart")) return;
    navigate("/cart");
  }

  function handleProfileClick() {
    if (!requireAuth("/profile")) return;
    navigate("/profile");
  }

  function handleOrdersClick() {
    if (!requireAuth("/orders")) return;
    navigate("/orders");
  }

  return (
    <Box
      bg="white"
      px={{ base: 3, md: 4 }}
      py={3}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex align="center" maxW="1200px" mx="auto">
        {/* Left: Store / Logo */}
        <HStack
          spacing={3}
          cursor="pointer"
          onClick={() => {
            navigate("/");
            // reset category selection when clicking logo (optional)
            setSelectedCategory("All");
            if (onCategorySelect) onCategorySelect("");
          }}
        >
          <Box bg="red.400" color="white" p={2} borderRadius="md">
            <FaStore />
          </Box>
          <Text fontWeight="bold" fontSize="lg">
            MyStore
          </Text>
        </HStack>

        {/* Middle: categories */}
        <HStack
          spacing={3}
          ml={6}
          display={{ base: "none", md: "flex" }}
          align="center"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Box
                key={cat}
                as="button"
                onClick={() => handleCategoryClick(cat)}
                aria-pressed={isSelected}
                px={3}
                py={1}
                borderRadius="md"
                cursor="pointer"
                transition="all 0.18s ease"
                // selected styling: subtle gradient + elevated box
                bg={isSelected ? "linear-gradient(90deg, rgba(237, 242, 247, 1), rgba(245, 243, 255, 1))" : "transparent"}
                boxShadow={isSelected ? "sm" : "none"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                _active={{ transform: "translateY(0)" }}
                color={isSelected ? "black" : "gray.700"}
                fontWeight={isSelected ? "semibold" : "medium"}
              >
                <Text fontSize="sm" px={1}>
                  {cat}
                </Text>
              </Box>
            );
          })}
        </HStack>

        {/* Search */}
        <Flex flex="1" justify="center" px={4}>
          <Input
            placeholder="Search products..."
            maxW={isMobile ? "60%" : "640px"}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            size="md"
            borderRadius="lg"
            boxShadow="sm"
          />
        </Flex>

        {/* Right: icons */}
        <HStack spacing={{ base: 2, md: 4 }}>
          {/* Wishlist - larger, reddish-pink */}
          <Tooltip label="Wishlist" openDelay={300}>
            <Box
              position="relative"
              cursor="pointer"
              onClick={handleWishlistClick}
              aria-label="Wishlist"
            >
              <IconButton
                aria-label="Wishlist"
                icon={<Icon as={FaHeart} boxSize={5} />}
                variant="ghost"
                size="md"
                _hover={{ bg: "transparent" }}
              />
              {/* override color via absolute Icon so we can set color more easily */}
              <Box position="absolute" left="7px" top="7px" pointerEvents="none">
                <Icon as={FaHeart} boxSize={5} color="pink.500" />
              </Box>

              {wishlistCount > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-6"
                  bg="pink.600"
                  color="white"
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Box>
          </Tooltip>

          {/* Cart - larger, blue */}
          <Tooltip label="Cart" openDelay={300}>
            <Box
              position="relative"
              cursor="pointer"
              onClick={handleCartClick}
              aria-label="Cart"
            >
              <IconButton
                aria-label="Cart"
                icon={<Icon as={FaShoppingCart} boxSize={5} />}
                variant="ghost"
                size="md"
                _hover={{ bg: "transparent" }}
              />
              <Box position="absolute" left="7px" top="7px" pointerEvents="none">
                <Icon as={FaShoppingCart} boxSize={5} color="blue.500" />
              </Box>

              {cartCount > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-6"
                  bg="blue.600"
                  color="white"
                  borderRadius="full"
                  px={2}
                  fontSize="xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Box>
          </Tooltip>

          {/* Orders (only when logged in) */}
          {user && (
            <Button
              leftIcon={<FaBoxOpen />}
              colorScheme="teal"
              variant="solid"
              size="sm"
              onClick={handleOrdersClick}
            >
              Orders
            </Button>
          )}

          {/* Profile / Login / Logout */}
          {user ? (
            <HStack spacing={2}>
              <Avatar
                size="sm"
                name={user.username}
                cursor="pointer"
                onClick={handleProfileClick}
              />
              <Text
                fontSize="sm"
                cursor="pointer"
                onClick={handleProfileClick}
                display={{ base: "none", md: "block" }}
              >
                {user.username}
              </Text>

              {/* logout icon button */}
              <Tooltip label="Logout">
                <IconButton
                  aria-label="Logout"
                  icon={<FaSignOutAlt />}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                />
              </Tooltip>
            </HStack>
          ) : (
            <Button colorScheme="red" size="sm" onClick={() => openLoginModal()}>
              Login
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}