import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";

function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error(err));
  }, []);

  // 🔍 Filter whenever search or category changes
  useEffect(() => {
    let products = allProducts;

    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(products);
  }, [searchTerm, selectedCategory, allProducts]);

  return (
    <>
      <Navbar
        onSearch={setSearchTerm}
        onCategorySelect={setSelectedCategory}
      />
      <ProductGrid products={filteredProducts} />
    </>
  );
}

export default HomePage;
