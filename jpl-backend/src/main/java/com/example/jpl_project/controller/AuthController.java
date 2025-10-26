package com.example.jpl_project.controller;

import com.example.jpl_project.model.User;
import com.example.jpl_project.repository.UserRepository;
import com.example.jpl_project.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if (!passwordEncoder.matches(password, user.getPassword())) {
                        Map<String, Object> resp = new HashMap<>();
                        resp.put("success", false);
                        resp.put("message", "Invalid password");
                        return ResponseEntity.status(401).body(resp);
                    }
                    // generate token
                    String token = jwtUtil.generateToken(user.getUsername());
                    // hide password in response
                    user.setPassword(null);
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("success", true);
                    resp.put("message", "Login successful");
                    resp.put("user", user);
                    resp.put("token", token);
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("success", false);
                    resp.put("message", "User not found");
                    return ResponseEntity.status(404).body(resp);
                });
    }
}