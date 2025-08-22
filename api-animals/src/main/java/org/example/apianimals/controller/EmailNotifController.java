package org.example.apianimals.controller;

import org.example.apianimals.config.SnsPublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class EmailNotifController {
    private final SnsPublisher snsPublisher;

    @Autowired
    public EmailNotifController(SnsPublisher snsPublisher) {
        this.snsPublisher = snsPublisher;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            snsPublisher.subscribe(email);
            return ResponseEntity.ok("Verifica email-ul pentru a confirma subscriptia.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Eroare la subscriere: " + e.getMessage());
        }
    }
}