package com.example.jpl_project.controller;

import com.example.jpl_project.model.Product;
import com.example.jpl_project.model.User;
import com.example.jpl_project.model.WishlistItem;
import com.example.jpl_project.repository.ProductRepository;
import com.example.jpl_project.repository.UserRepository;
import com.example.jpl_project.repository.WishlistRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistController(WishlistRepository wishlistRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Get all wishlist items for a user
    @GetMapping("/{userId}")
    public List<WishlistItem> getWishlist(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUser(user);
    }

    // Add product to wishlist
    @PostMapping("/add")
    public WishlistItem addToWishlist(@RequestParam Long userId, @RequestParam Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already in wishlist
        List<WishlistItem> existing = wishlistRepository.findByUser(user);
        for(WishlistItem item : existing) {
            if(item.getProduct().getId().equals(productId)) {
                return item; // already added
            }
        }

        WishlistItem wishlistItem = new WishlistItem(user, product);
        return wishlistRepository.save(wishlistItem);
    }

    // Remove product from wishlist
    @DeleteMapping("/remove/{wishlistItemId}")
    public String removeFromWishlist(@PathVariable Long wishlistItemId) {
        if(wishlistRepository.existsById(wishlistItemId)) {
            wishlistRepository.deleteById(wishlistItemId);
            return "Removed from wishlist";
        } else {
            return "Wishlist item not found";
        }
    }
}
