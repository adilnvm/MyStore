import { useEffect, useState } from "react";
import { SimpleGrid, Container, Heading } from "@chakra-ui/react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/productCard";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <Container maxW="container.xl" py="8">
      <Heading mb="6" textAlign="center">All Products</Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing="6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
