package com.example.jpl_project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WishlistItem> wishlistItems;


    @Column(nullable = false)
    private String name;

    private String category;

    @Column(nullable = false)
    private Double price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private Integer quantity;

    private LocalDateTime createdAt = LocalDateTime.now();

    // No-arg constructor
    public Product() { }

    // Constructor with fields
    public Product(String name, String category, Double price, Integer quantity, String imageUrl) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
