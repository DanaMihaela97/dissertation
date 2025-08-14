package org.example.apigateway.controller;

import org.example.apigateway.dto.RegisterRequest;
import org.example.apigateway.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {RequestMethod.POST, RequestMethod.OPTIONS})
public class RegisterController {
    private final UserServiceImpl userService;

    @Autowired
    public RegisterController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }
}
