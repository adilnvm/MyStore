import React, { useState } from "react";
import {
  Box, Heading, Input, Button, VStack, Text, useToast, Center, HStack, Icon
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const API = `${import.meta.env.VITE_API_BASE_URL}/api/admin/login`;

  const handleLogin = async () => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({ title: "Login failed", description: data.message || "Invalid credentials", status: "error", duration: 3000, isClosable: true });
        return;
      }

      // mark admin session (simple)
      localStorage.setItem("admin", "true");
      localStorage.setItem("adminUser", JSON.stringify(data.user || { username }));
      toast({ title: "Welcome, admin", status: "success", duration: 1500, isClosable: true });
      navigate("/admin");
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Center minH="80vh" bg="gray.50" p={4}>
      <Box maxW="420px" w="full" p={6} bg="white" boxShadow="md" borderRadius="md">
        <HStack mb={4}>
          <Icon as={FaUserShield} boxSize={7} color="purple.600" />
          <Heading size="md">Admin Login</Heading>
        </HStack>

        <VStack spacing={4}>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button colorScheme="purple" w="full" onClick={handleLogin}>Sign in</Button>
          <Text fontSize="sm" color="gray.500">Admin credentials are stored in backend. Can Create new admin  via POST /api/admin/add with body and ROLE = "ADMIN"</Text>
        </VStack>
      </Box>
    </Center>
  );
}