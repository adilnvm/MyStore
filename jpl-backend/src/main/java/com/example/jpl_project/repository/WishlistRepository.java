package com.example.jpl_project.repository;

import com.example.jpl_project.model.WishlistItem;
import com.example.jpl_project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
}
