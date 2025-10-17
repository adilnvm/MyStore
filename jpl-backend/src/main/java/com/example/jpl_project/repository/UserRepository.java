package com.example.jpl_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.jpl_project.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // ✅ ADD THIS METHOD
    Optional<User> findByEmail(String email);

}