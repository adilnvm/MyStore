package com.example.jpl_project.controller;

import com.example.jpl_project.model.Product;
import com.example.jpl_project.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;

    public AdminProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // POST add a new product
    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // PUT update an existing product
    @PutMapping("/update/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setName(updatedProduct.getName());
            product.setCategory(updatedProduct.getCategory());
            product.setPrice(updatedProduct.getPrice());
            product.setQuantity(updatedProduct.getQuantity());
            return productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    // DELETE a product
    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        if(productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return "Product deleted successfully";
        } else {
            return "Product not found with id: " + id;
        }
    }
}
