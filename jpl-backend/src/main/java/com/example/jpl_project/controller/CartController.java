package com.example.jpl_project.controller;

import com.example.jpl_project.model.CartItem;
import com.example.jpl_project.model.Product;
import com.example.jpl_project.model.User;
import com.example.jpl_project.repository.CartRepository;
import com.example.jpl_project.repository.ProductRepository;
import com.example.jpl_project.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Get all items for a user
    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()) {
            return cartRepository.findByUser(userOpt.get());
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // Add product to cart
    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long userId,
                              @RequestParam Long productId,
                              @RequestParam(defaultValue = "1") Integer qty) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already in cart
        List<CartItem> existingItems = cartRepository.findByUser(user);
        for(CartItem item : existingItems) {
            if(item.getProduct().getId().equals(productId)) {
                item.setQuantity(item.getQuantity() + qty);
                return cartRepository.save(item);
            }
        }

        CartItem cartItem = new CartItem(user, product, qty);
        return cartRepository.save(cartItem);
    }

    // Update quantity
    @PutMapping("/update/{cartItemId}")
    public CartItem updateQuantity(@PathVariable Long cartItemId, @RequestParam Integer qty) {
        if(qty == null || qty < 1) {
            throw new RuntimeException("Quantity must be >= 1");
        }

        return cartRepository.findById(cartItemId).map(item -> {
            item.setQuantity(qty);
            return cartRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Cart item not found"));
    }


    // Remove item
    @DeleteMapping("/remove/{cartItemId}")
    public String removeFromCart(@PathVariable Long cartItemId) {
        if(cartRepository.existsById(cartItemId)) {
            cartRepository.deleteById(cartItemId);
            return "Removed from cart";
        } else {
            return "Cart item not found";
        }
    }
}
