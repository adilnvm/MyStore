// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Flex,
  Spinner,
  Center,
  Heading,
  Badge,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { FaShoppingBag, FaClock, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem("orders")) || [];
      // ensure we have an array
      setOrders(Array.isArray(stored) ? stored : []);
    } catch (err) {
      console.error("Failed to parse orders from localStorage", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const displayOrders = orders.slice().reverse(); // newest first

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      {/* Banner / Logo area */}
      <Flex
        align="center"
        justify="center"
        bgGradient="linear(to-r, blue.600, purple.600)"
        color="white"
        py={6}
        px={4}
      >
        <HStack spacing={4} maxW="1200px" w="full">
          <Icon as={FaShoppingBag} boxSize={8} />
          <Box>
            <Heading size="lg" lineHeight="short">
              MyStore — Orders
            </Heading>
            <Text fontSize="sm" opacity={0.9}>
              View your order history and track recent purchases
            </Text>
          </Box>
        </HStack>
      </Flex>

      <Box maxW="1200px" mx="auto" p={6}>
        {/* Loading */}
        {loading ? (
          <Center py={16}>
            <VStack spacing={4}>
              <Spinner size="xl" speed="0.9s" />
              <Text>Loading orders...</Text>
            </VStack>
          </Center>
        ) : displayOrders.length === 0 ? (
          // Empty state
          <Center py={16}>
            <VStack spacing={6}>
              <Icon as={FaClock} boxSize={12} color="gray.400" />
              <Heading size="md">No past orders</Heading>
              <Text color="gray.600" maxW="560px" textAlign="center">
                You haven't placed any orders yet. Start shopping and your orders will appear here.
              </Text>
              <Button colorScheme="red" onClick={() => (window.location.href = "/")}>
                Browse Products
              </Button>
            </VStack>
          </Center>
        ) : (
          // Orders list
          <VStack spacing={6} align="stretch">
            {displayOrders.map((order, idx) => {
              // Support two possible shapes:
              // 1) backend Order object { id, items: [...], createdAt, status }
              // 2) local-storage order represented as an array of items (order is array)
              const isBackendOrder = order && typeof order === "object" && Array.isArray(order.items);
              const items = isBackendOrder ? order.items : Array.isArray(order) ? order : [];
              const orderId = isBackendOrder ? order.id : displayOrders.length - idx;
              const createdAt = isBackendOrder ? order.createdAt : null;
              const status = isBackendOrder ? order.status : "COMPLETED";

              // calculate totals for this order
              const orderTotal = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

              return (
                <Box key={idx} borderWidth="1px" borderRadius="md" p={4} bg="white" boxShadow="sm">
                  <Flex justify="space-between" align="center" mb={3}>
                    <HStack>
                      <Heading size="sm">Order #{orderId}</Heading>
                      {createdAt && (
                        <Text fontSize="sm" color="gray.500">
                          • {new Date(createdAt).toLocaleString()}
                        </Text>
                      )}
                      <Badge colorScheme={status === "PENDING" ? "yellow" : status === "COMPLETED" ? "green" : "red"}>
                        {status || "N/A"}
                      </Badge>
                    </HStack>

                    <Text fontWeight="bold">Total: ₹{orderTotal}</Text>
                  </Flex>

                  <VStack spacing={3} align="stretch">
                    {items.map((item) => (
                      <Flex key={item.id || `${item.name}-${Math.random()}`} justify="space-between" align="center">
                        <HStack>
                          <Image
                            src={"http://localhost:8080/img/default-product.png"}
                            boxSize="64px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <Box>
                            <Text fontWeight="semibold">{item.name || item.product?.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {item.product?.category || item.category || ""}
                            </Text>
                          </Box>
                        </HStack>

                        <HStack spacing={6}>
                          <Text>Qty: {item.quantity || item.product?.quantity || 1}</Text>
                          <Text>₹{(item.price || item.product?.price || 0) * (item.quantity || 1)}</Text>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default Orders;