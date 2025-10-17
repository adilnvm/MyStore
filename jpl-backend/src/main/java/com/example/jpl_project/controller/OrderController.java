package com.example.jpl_project.controller;

import com.example.jpl_project.model.CartItem;
import com.example.jpl_project.model.Order;
import com.example.jpl_project.model.User;
import com.example.jpl_project.repository.CartRepository;
import com.example.jpl_project.repository.OrderRepository;
import com.example.jpl_project.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    // Place order from cart
    @PostMapping("/place/{userId}")
    public Order placeOrder(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<CartItem> cartItems = cartRepository.findByUser(user);

        if(cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setItems(cartItems);
        orderRepository.save(order);

        // Clear cart after order
        cartRepository.deleteAll(cartItems);

        return order;
    }

    // Get all orders for a user
    @GetMapping("/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }
}
