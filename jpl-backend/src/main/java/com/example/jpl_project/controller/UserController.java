package com.example.jpl_project.controller;

import com.example.jpl_project.model.User;
import com.example.jpl_project.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        System.out.println(STR."Register request:USERNAME: \{user.getUsername()} | EMAIL\{user.getEmail()}");

        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if(user.getEmail() != null && userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        if(user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        // **This is correct** — password encoded, username/email untouched
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }



    // LOGIN user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String,String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if(!passwordEncoder.matches(password, user.getPassword())) {
                        return ResponseEntity
                                .status(401)
                                .body("Invalid password");
                    }
                    return ResponseEntity.ok(user);
                })
                .orElseGet(() -> ResponseEntity
                        .status(404)
                        .body("User not found"));
    }
}
