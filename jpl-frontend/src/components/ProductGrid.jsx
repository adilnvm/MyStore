// import { SimpleGrid, Box, Text, Image, Button } from "@chakra-ui/react"; 
// function ProductGrid({ products })
//  {
//      return (
//          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} p={6}> 
//          {products.map(product => 
//             ( <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}> 
//             <Image src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} boxSize="200px" objectFit="cover" mx="auto" />
//              <Text fontWeight="bold" mt={2}>{product.name}</Text> <Text>${product.price}</Text> 
//              <Text>Qty: {product.quantity}</Text>
//               <Button mt={2} colorScheme="blue" width="full">Add to Cart</Button> </Box> 
//             ))} 
//         </SimpleGrid> 
//         );
// } 
// export default ProductGrid;
import { SimpleGrid } from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

function ProductGrid({ products }) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} p={6}>
      {products.map((product) => (
        // <Link key={product.id} to={`/products/${product.id}`}>
          <ProductCard product={product} />
        // </Link>
      ))}
    </SimpleGrid>
  );
}

export default ProductGrid;
