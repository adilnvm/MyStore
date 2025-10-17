package com.example.jpl_project.controller;

import com.example.jpl_project.model.User;
import com.example.jpl_project.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // allow your frontend dev port
public class AdminController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Admin login: accepts { "username": "...", "password": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody User loginUser) {
        Optional<User> userOpt = userRepository.findByUsername(loginUser.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Check role first
            if (!"ADMIN".equals(user.getRole())) {
                Map<String,Object> resp = new HashMap<>();
                resp.put("success", false);
                resp.put("message", "User is not an admin");
                return ResponseEntity.status(403).body(resp);
            }

            // BCrypt password check
            if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
                Map<String,Object> resp = new HashMap<>();
                resp.put("success", false);
                resp.put("message", "Invalid password");
                return ResponseEntity.status(401).body(resp);
            }

            // success — remove password before returning
            user.setPassword(null);
            Map<String,Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("message", "Admin login successful");
            resp.put("user", user);
            return ResponseEntity.ok(resp);
        } else {
            Map<String,Object> resp = new HashMap<>();
            resp.put("success", false);
            resp.put("message", "User not found");
            return ResponseEntity.status(404).body(resp);
        }
    }
}