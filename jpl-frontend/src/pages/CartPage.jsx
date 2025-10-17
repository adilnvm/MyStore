import React from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useStore } from "../context/StoreContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = [...cart];
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

    cart.forEach(item => removeFromCart(item.id));

    toast({
      title: "Order placed successfully!",
      description: "You can see your order in Orders page.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });

    navigate("/orders");
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" h="70vh" direction="column">
          <Text fontSize="xl" mb={4}>No products in cart.</Text>
          <Button colorScheme="red" onClick={() => navigate("/")}>Browse Products</Button>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Flex p={6} gap={6} direction={{ base: "column", md: "row" }}>
        {/* Cart Items */}
        <Box flex="2">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
                <Th>Subtotal</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cart.map(item => (
                <Tr key={item.id}>
                  <Td>
                    <HStack>
                      <Image boxSize="50px" src={"http://localhost:8080/img/default-product.png"} />
                      <Text>{item.name}</Text>
                    </HStack>
                  </Td>
                  <Td>₹{item.price}</Td>
                  <Td>
                    <HStack>
                      <IconButton
                        size="sm"
                        icon={<MinusIcon />}
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        isDisabled={item.quantity <= 1}
                      />
                      <Text px={2}>{item.quantity}</Text>
                      <IconButton
                        size="sm"
                        icon={<AddIcon />}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      />
                    </HStack>
                  </Td>
                  <Td>₹{item.price * item.quantity}</Td>
                  <Td>
                    <Button size="sm" colorScheme="red" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Cart Summary */}
        <Box flex="1" borderWidth="1px" borderRadius="md" p={4} h="fit-content">
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="bold" fontSize="lg">Cart Total</Text>
            <Flex justify="space-between"><Text>Subtotal:</Text><Text>₹{subtotal}</Text></Flex>
            <Flex justify="space-between"><Text>Shipping:</Text><Text>Free</Text></Flex>
            <Flex justify="space-between" fontWeight="bold" fontSize="lg"><Text>Total:</Text><Text>₹{subtotal}</Text></Flex>
            <Button colorScheme="red" w="full" onClick={handleCheckout}>Proceed to Checkout</Button>
          </VStack>
        </Box>
      </Flex>
    </>
  );
}

export default Cart;


// //-------------------------------------test1--------------------

// import React from "react";
// import {
//   Box,
//   Flex,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Image,
//   Button,
//   Input,
//   Text,
//   VStack,
//   HStack,
//   useToast
// } from "@chakra-ui/react";
// import { useStore } from "../context/StoreContext";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";

// function Cart() {
//   const { cart, removeFromCart, updateCartQuantity } = useStore();
//   const toast = useToast();
//   const navigate = useNavigate();

//   const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const handleCheckout = () => {
//     // Save order to localStorage
//     const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
//     const newOrder = [...cart];
//     localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

//     // Clear cart
//     localStorage.setItem("cart", JSON.stringify([]));
//     cart.forEach(item => removeFromCart(item.id));

//     toast({
//       title: "Order placed successfully!",
//       description: "You can see your order in Orders page.",
//       status: "success",
//       duration: 3000,
//       isClosable: true,
//       position: "top"
//     });

//     navigate("/orders");
//   };

//   if (cart.length === 0) {
//     return (
//       <>
//         <Navbar />
//         <Flex justify="center" align="center" h="70vh" direction="column">
//           <Text fontSize="xl" mb={4}>No products in cart.</Text>
//           <Button colorScheme="red" onClick={() => navigate("/")}>Browse Products</Button>
//         </Flex>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <Flex p={6} gap={6} direction={{ base: "column", md: "row" }}>
//         {/* Cart Items */}
//         <Box flex="2">
//           <Table variant="simple">
//             <Thead>
//               <Tr>
//                 <Th>Product</Th>
//                 <Th>Price</Th>
//                 <Th>Quantity</Th>
//                 <Th>Subtotal</Th>
//                 <Th>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {cart.map(item => (
//                 <Tr key={item.id}>
//                   <Td>
//                     <HStack>
//                       <Image boxSize="50px" src={item.imageUrl || "https://via.placeholder.com/50"} />
//                       <Text>{item.name}</Text>
//                     </HStack>
//                   </Td>
//                   <Td>₹{item.price}</Td>
//                   <Td>
//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       min={1}
//                       width="60px"
//                       onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
//                     />
//                   </Td>
//                   <Td>₹{item.price * item.quantity}</Td>
//                   <Td>
//                     <Button size="sm" colorScheme="red" onClick={() => removeFromCart(item.id)}>Remove</Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </Box>

//         {/* Cart Summary */}
//         <Box flex="1" borderWidth="1px" borderRadius="md" p={4} h="fit-content">
//           <VStack align="stretch" spacing={4}>
//             <Text fontWeight="bold" fontSize="lg">Cart Total</Text>
//             <Flex justify="space-between"><Text>Subtotal:</Text><Text>₹{subtotal}</Text></Flex>
//             <Flex justify="space-between"><Text>Shipping:</Text><Text>Free</Text></Flex>
//             <Flex justify="space-between" fontWeight="bold" fontSize="lg"><Text>Total:</Text><Text>₹{subtotal}</Text></Flex>
//             <Button colorScheme="red" w="full" onClick={handleCheckout}>Proceed to Checkout</Button>
//           </VStack>
//         </Box>
//       </Flex>
//     </>
//   );
// }

// export default Cart;
