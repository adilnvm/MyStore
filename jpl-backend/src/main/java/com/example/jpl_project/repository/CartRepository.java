package com.example.jpl_project.repository;

import com.example.jpl_project.model.CartItem;
import com.example.jpl_project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
}
