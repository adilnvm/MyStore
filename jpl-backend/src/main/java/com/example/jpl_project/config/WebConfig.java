package com.example.jpl_project.config; // **Adjust package name**

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Reads origins from an environment variable, defaulting to local dev for safety
    private final String allowedOrigins = System.getenv().getOrDefault("ALLOWED_CORS_ORIGINS", "http://localhost:5173");

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all API paths
                .allowedOrigins(allowedOrigins.split(",")) // Use origins from the ENV var
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all required methods
                .allowCredentials(true); // Needed if using sessions/tokens
    }
}