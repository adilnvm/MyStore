// src/components/ProductCard.jsx
import React from "react";
import { Box, Image, Text, Button, IconButton, HStack } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { requireAuth, openLoginModal } = useAuth();

  const isWishlisted = wishlist.some(item => item.id === product.id);

  function handleWishlistClick(e) {
    e.stopPropagation();
    // require authentication first
    if (!requireAuth(`/products/${product.id}`)) return;
    toggleWishlist(product);
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    if (!requireAuth(`/cart`)) return;
    addToCart(product);
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} position="relative" _hover={{ boxShadow: "md" }}>
      <IconButton
        icon={isWishlisted ? <FaHeart color="red" /> : <FaRegHeart />}
        position="absolute"
        top="2"
        right="2"
        onClick={handleWishlistClick}
        aria-label="wishlist"
      />

      {/* clickable image + name link */}
      <Link to={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
        <Image
          src={`${import.meta.env.VITE_API_BASE_URL}/img/default-product.png`}
          alt={product.name}
          boxSize="200px"
          objectFit="cover"
          mx="auto"
        />
        <Text fontWeight="bold" mt={2} textAlign="center">{product.name}</Text>
      </Link>

      <Text textAlign="center">₹{product.price}</Text>

      <HStack justify="center" mt={2}>
        <Button colorScheme="blue" onClick={handleAddToCart}>Add to Cart</Button>
      </HStack>
    </Box>
  );
}

export default ProductCard;
