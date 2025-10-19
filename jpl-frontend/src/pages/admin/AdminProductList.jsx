// src/pages/admin/AdminProductList.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Button,
  IconButton,
  useToast,
  Spinner,
  Center,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

/**
 * AdminProductList
 * - Fetches /api/admin/products
 * - Displays in table with S/N, image, name, price, quantity, actions
 * - Edit: opens Chakra Modal with prefilled fields -> PUT to /api/admin/products/update/{id}
 * - Delete: opens Chakra AlertDialog -> DELETE to /api/admin/products/delete/{id}
 */

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // product object currently editing
  const toast = useToast();

  // modal controls (edit)
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  // delete dialog controls
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();
  const cancelRef = useRef(); // for AlertDialog
  const [deleteId, setDeleteId] = useState(null);

  // edit form state
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // load products
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast({ title: "Failed to load products", status: "error", duration: 4000 });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // open edit modal and populate form
  function handleOpenEdit(product) {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      imageUrl: product.imageUrl || "",
    });
    openEdit();
  }

  // send update
  async function handleUpdateSubmit() {
    if (!editingProduct) return;
    // basic validation
    if (!form.name || form.price === "" || form.quantity === "") {
      toast({ title: "Please fill all required fields", status: "warning" });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/products/update/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            price: parseFloat(form.price),
            quantity: parseInt(form.quantity, 10),
            imageUrl: form.imageUrl,
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Update failed");
      }

      const updated = await res.json();

      // update local list
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

      toast({ title: "Product updated", status: "success", duration: 2500 });
      closeEdit();
      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed:", err);
      toast({ title: "Update failed", description: err.message || "", status: "error" });
    }
  }

  // open delete confirmation for id
  function confirmDelete(id) {
    setDeleteId(id);
    openDelete();
  }

  // perform delete
  async function handleDeleteConfirmed() {
    const id = deleteId;
    if (!id) {
      closeDelete();
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Delete failed");
      }

      // remove from UI
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Product deleted", status: "success", duration: 2000 });
    } catch (err) {
      console.error("Delete failed:", err);
      toast({ title: "Delete failed", description: err.message || "", status: "error" });
    } finally {
      setDeleteId(null);
      closeDelete();
    }
  }

  // helper to construct image src safely (supports absolute URLs or backend-relative paths)
  function resolveImageUrl(product) {
    if (!product?.imageUrl) return "https://via.placeholder.com/100";
    if (product.imageUrl.startsWith("http://") || product.imageUrl.startsWith("https://")) {
      return product.imageUrl;
    }
    // if backend serves /images/... from localhost:10000
    return `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`;
  }

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box bg="white" borderRadius="md" boxShadow="sm" p={4}>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        Products
      </Text>

      {products.length === 0 ? (
        <Text color="gray.600">No products found. Add one with the + button above.</Text>
      ) : (
        <Table variant="simple" size="sm" borderRadius="md" overflowX="auto">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Qty</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {products.map((p, idx) => (
              <Tr key={p.id}>
                <Td>{idx + 1}</Td>
                <Td>
                  <Image
                    src={resolveImageUrl(p)}
                    alt={p.name}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Td>
                <Td maxW="200px">
                  <Text fontWeight="medium" isTruncated maxW="200px">{p.name}</Text>
                </Td>
                <Td>{p.category}</Td>
                <Td isNumeric>₹{p.price}</Td>
                <Td isNumeric>{p.quantity}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button leftIcon={<EditIcon />} size="sm" colorScheme="blue" onClick={() => handleOpenEdit(p)}>
                      Edit
                    </Button>
                    <IconButton
                      aria-label="Delete product"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => confirmDelete(p.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => { closeEdit(); setEditingProduct(null); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Category</FormLabel>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Price</FormLabel>
              <NumberInput min={0} value={form.price} onChange={(val) => setForm({ ...form, price: val })}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput min={0} value={form.quantity} onChange={(val) => setForm({ ...form, quantity: val })}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Image URL</FormLabel>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => { closeEdit(); setEditingProduct(null); }}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateSubmit}>
              Save changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE CONFIRMATION ALERTDIALOG */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={() => { closeDelete(); setDeleteId(null); }}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete product</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => { closeDelete(); setDeleteId(null); }}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirmed} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}