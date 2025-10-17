import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  Center,
  Avatar,
  HStack,
  Stack,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      // For now, using localStorage to simulate logged-in user
      const storedUser = JSON.parse(localStorage.getItem("user")) || null;
      setUser(storedUser);
    } catch (err) {
      console.error("Failed to load user from localStorage", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      {/* Banner */}
      <Flex
        align="center"
        justify="center"
        bgGradient="linear(to-r, teal.600, green.600)"
        color="white"
        py={6}
        px={4}
      >
        <HStack spacing={4} maxW="1200px" w="full">
          <FaUserCircle size={36} />
          <Box>
            <Heading size="lg" lineHeight="short">
              My Profile
            </Heading>
            <Text fontSize="sm" opacity={0.9}>
              Manage your personal details and account information
            </Text>
          </Box>
        </HStack>
      </Flex>

      <Box maxW="800px" mx="auto" p={6}>
        {loading ? (
          <Center py={16}>
            <VStack spacing={4}>
              <Spinner size="xl" speed="0.9s" />
              <Text>Loading profile...</Text>
            </VStack>
          </Center>
        ) : !user ? (
          <Center py={16} flexDirection="column">
            <Text fontSize="xl" mb={4}>No user logged in.</Text>
            <Button colorScheme="teal" onClick={() => window.location.href = "/login"}>
              Login / Register
            </Button>
          </Center>
        ) : (
          <VStack spacing={6} align="stretch" bg="white" p={6} borderRadius="md" boxShadow="sm">
            <Flex align="center" mb={4}>
              <Avatar size="xl" name={user.username} mr={6} />
              <Box>
                <Heading size="md">{user.username}</Heading>
                <Text color="gray.500">{user.role || "Customer"}</Text>
              </Box>
            </Flex>

            <Stack spacing={3}>
              <Box>
                <Text fontWeight="semibold">Email:</Text>
                <Text>{user.email}</Text>
              </Box>
              <Box>
                <Text fontWeight="semibold">Account Created:</Text>
                <Text>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</Text>
              </Box>
            </Stack>

            <Button colorScheme="teal" mt={4} alignSelf="flex-start">
              Edit Profile
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default Profile;
