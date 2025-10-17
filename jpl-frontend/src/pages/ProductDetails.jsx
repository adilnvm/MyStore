import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  HStack,
  IconButton,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  // Simulate fetching product data (in a real app, fetch from backend)
  useEffect(() => {
    // Example static product data (you’ll later replace with backend call)
    const exampleProduct = {
      id: 1,
      name: "Huawei P60 Pro",
      category: "Smartphones",
      price: 799,
      imageUrl:
        "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/p60-pro/images/p60-pro-gold.png",
      quantity: 6,
      createdAt: "2025-10-15T12:15:00.000Z",
    };
    setProduct(exampleProduct);
  }, [id]);

  const handleAddToCart = () => {
    if (qty < 1) return;
    addToCart({ ...product, quantity: qty });
    toast({
      title: "Product added to cart!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
    navigate("/cart");
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" h="80vh">
          <Text>Loading product...</Text>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Flex p={8} justify="center" gap={12} direction={{ base: "column", md: "row" }}>
        {/* Product Image */}
        <Box flex="1" display="flex" justifyContent="center" alignItems="center">
          <Image
            src={"http://localhost:8080/img/default-product.png"}
            alt={product.name}
            boxSize="400px"
            objectFit="contain"
            borderRadius="md"
            shadow="lg"
          />
        </Box>

        {/* Product Info */}
        <VStack align="start" spacing={4} flex="1">
          <Text fontSize="3xl" fontWeight="bold">
            {product.name}
          </Text>
          <Text color="green.400" fontWeight="semibold">
            IN STOCK
          </Text>
          <Text fontSize="2xl" fontWeight="medium">
            ₹{product.price}
          </Text>

          {/* Quantity Selector */}
          <HStack
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            overflow="hidden"
            spacing={0}
          >
            <IconButton
              icon={<MinusIcon />}
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
              aria-label="Decrease quantity"
              borderRadius="none"
              w="50px"
              h="50px"
            />
            <Box
              w="50px"
              h="50px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              fontWeight="bold"
            >
              {qty}
            </Box>
            <IconButton
              icon={<AddIcon />}
              onClick={() => setQty(qty + 1)}
              aria-label="Increase quantity"
              borderRadius="none"
              w="50px"
              h="50px"
            />
          </HStack>

          {/* Place Order Button */}
          <Button
            colorScheme="red"
            size="lg"
            w="full"
            mt={4}
            onClick={handleAddToCart}
          >
            Place Order
          </Button>
        </VStack>
      </Flex>
    </>
  );
}

export default ProductDetails;
