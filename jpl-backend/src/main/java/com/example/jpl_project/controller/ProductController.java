package com.example.jpl_project.controller;

import com.example.jpl_project.model.Product;
import com.example.jpl_project.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.status(404).body("Product not found with ID: " + id);
        }
    }

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

//     GET products by category
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productRepository.findByCategory(category);
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {

        try {
            return productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

//    }
    // POST add a product list array
    @PostMapping("/bulk-add")
    public ResponseEntity<List<Product>> addMultiple(@RequestBody List<Product> products) {
        return ResponseEntity.ok(productRepository.saveAll(products));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Product with ID " + id + " deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Product not found with ID: " + id);
        }
    }

    // Search products by keyword
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
}

