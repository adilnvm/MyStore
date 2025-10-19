// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Box, Input, Button, Heading, VStack, Text, useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "@chakra-ui/react"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // read redirectTo query param if present
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") ? decodeURIComponent(params.get("redirectTo")) : null;

  async function handleLogin() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const txt = await res.text();
        toast({ title: "Login failed", description: txt, status: "error", duration: 3000, isClosable: true });
        return;
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      toast({ title: "Logged in", status: "success", duration: 1500, isClosable: true });

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast({ title: "Network error", description: err.message, status: "error", duration: 3000, isClosable: true });
    }
  }

  return (
    <Box maxW="420px" mx="auto" mt={12} p={6} borderWidth="1px" borderRadius="md">
      <Heading mb={6} textAlign="center">Login</Heading>
      <VStack spacing={4}>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button colorScheme="red" w="100%" onClick={handleLogin}>Login</Button>
        
      <Text fontSize="sm" color="gray.600">Or  {" "}
          <Link
        variant="underline"
        href="/register"
        colorPalette= 'red'
      >
         Register
      </Link>{" "}
      
       if you don't have an account</Text>
      </VStack>
    </Box>
  );
}
