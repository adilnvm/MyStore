// src/components/LoginModal.jsx
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
  const { modalOpen, closeLoginModal, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  async function handleLogin() {
    const result = await login({ username, password });
    if (!result.success) {
      toast({ title: "Login failed", description: result.message, status: "error", duration: 3000, isClosable: true });
      return;
    }
    toast({ title: "Logged in", status: "success", duration: 2000, isClosable: true });
  }

  function goToRegister() {
    closeLoginModal();
    navigate("/register");
  }

  return (
    <Modal isOpen={modalOpen} onClose={closeLoginModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign in to continue</ModalHeader>
        <ModalBody>
          <VStack spacing={3}>
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Text fontSize="sm" color="gray.600">You must be logged in to perform this action. Register if you don't have an account.</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={goToRegister}>Register</Button>
            <Button colorScheme="red" onClick={handleLogin}>Login</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
