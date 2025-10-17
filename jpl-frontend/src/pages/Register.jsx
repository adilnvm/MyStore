// src/pages/Register.jsx
import React, { useState } from "react";
import { Box, Input, Button, Heading, VStack, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        toast({ title: "Error", description: msg, status: "error", duration: 3000, isClosable: true });
        return;
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user)); // Save logged-in user
      toast({ title: "Registered successfully!", status: "success", duration: 3000, isClosable: true });
      navigate("/"); // Redirect to home
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={12} p={6} borderWidth="1px" borderRadius="md">
      <Heading mb={6} textAlign="center">Register</Heading>
      <VStack spacing={4}>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button colorScheme="blue" w="100%" onClick={handleRegister}>Register</Button>
      </VStack>
      <Text mt={4} textAlign="center">
        Already have an account? <Button variant="link" colorScheme="red" onClick={() => navigate("/login")}>Login</Button>
      </Text>
    </Box>
  );
}

export default Register;
