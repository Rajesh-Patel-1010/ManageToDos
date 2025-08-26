package com.example.todo_backend.controller;

import com.example.todo_backend.dto.AuthRequest;
import com.example.todo_backend.dto.AuthResponse;
import com.example.todo_backend.model.User;
import com.example.todo_backend.service.JwtUtil;
import com.example.todo_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody AuthRequest request) {
        try {
            User user = userService.registerUser(request.getUsername(), request.getPassword(), request.getEmail());
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody AuthRequest request) {
        return userService.findByUsername(request.getUsername())
                .filter(user -> userService.checkPassword(request.getPassword(), user.getPassword()))
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(user.getUsername()))))
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }
} 