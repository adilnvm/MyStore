package com.example.jpl_project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

//    @GetMapping("/")
//    public String home() {
//        return "Backend is running!";
//    }

    @GetMapping("/secure")
    public String secureEndpoint() {
        return "Securely..........working.....JWT endpoint works";
    }
}
