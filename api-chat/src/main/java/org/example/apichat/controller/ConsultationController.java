package org.example.apichat.controller;

import org.example.apichat.dto.Animal;
import org.example.apichat.service.impl.ChatServiceImpl;
import org.example.apichat.service.impl.ReviewServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ConsultationController {
    private final ChatServiceImpl chatService;
    private final ReviewServiceImpl reviewService;

    @Autowired
    public ConsultationController(ChatServiceImpl chatService, ReviewServiceImpl reviewService) {
        this.chatService = chatService;
        this.reviewService = reviewService;
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startChat(@RequestBody Animal animal) {
        try {
            Map<String, String> response = chatService.startSession(animal);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Eroare la începerea sesiunii: " + e.getMessage()));
        }
    }

    @PostMapping("/send/{sessionId}")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable Long sessionId,
            @RequestBody String userMessage) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (authentication != null && authentication.getCredentials() instanceof Jwt jwt) {
            email = jwt.getClaimAsString("email");
        }

        Map<String, Object> response = chatService.sendMessage(sessionId, userMessage, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public int getConsultationCount() {
        return chatService.consultationCount();
    }

}