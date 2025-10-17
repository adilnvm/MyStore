package com.example.jpl_project.repository;

import com.example.jpl_project.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);


    List<Product> findByNameContainingIgnoreCase(String keyword);
}
