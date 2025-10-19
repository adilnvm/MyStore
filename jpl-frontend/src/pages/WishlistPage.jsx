import React from "react";
import { Box, Heading, SimpleGrid, VStack, Text, Button, HStack, Image } from "@chakra-ui/react";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const navigate = useNavigate();

  // If wishlist is empty, show empty state
  if (!wishlist || wishlist.length === 0) {
    return (
      <VStack mt={10} spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Your Wishlist is empty ❤️
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/")}>
          Browse Products
        </Button>
      </VStack>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={4}>Your Wishlist ❤️</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {wishlist.map((item) => (
          <Box
            key={item.id}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            shadow="sm"
            p={3}
          >
            <VStack spacing={3}>
              <Image
                src={`${import.meta.env.VITE_API_BASE_URL}/img/default-product.png`}
                alt={item.name}
                boxSize="150px"
                objectFit="cover"
                borderRadius="md"
              />
              <Text fontWeight="bold" noOfLines={2} textAlign="center">
                {item.name}
              </Text>
              <Text color="gray.600">₹{item.price}</Text>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => toggleWishlist(item)}
                >
                  Remove
                </Button>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default WishlistPage;
