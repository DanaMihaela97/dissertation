package org.example.apichat.controller;

import org.example.apichat.entity.ChatSession;
import org.example.apichat.entity.Consultation;
import org.example.apichat.repository.ChatSessionRepository;
import org.example.apichat.repository.ConsultationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/consultations")
public class AdminConsultationController {
    private final ConsultationRepository consultationRepository;
    private final ChatSessionRepository chatSessionRepository;

    @Autowired
    public AdminConsultationController(
            ConsultationRepository consultationRepository,
            ChatSessionRepository chatSessionRepository
    ) {
        this.consultationRepository = consultationRepository;
        this.chatSessionRepository = chatSessionRepository;
    }

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<?> validateConsultation(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        return consultationRepository.findById(id)
                .map(c -> {
                    c.setValidated(true);
                    c.setAdminComment(request.getOrDefault("comment", ""));
                    if (authentication != null) {
                        c.setValidatedBy(authentication.getName());
                    }
                    consultationRepository.save(c);
                    return ResponseEntity.ok(Map.of("message", "Consultația a fost validată."));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Consultația nu a fost găsită")));
    }

    @PostMapping("/{id}/invalidate")
    public ResponseEntity<?> invalidateConsultation(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        return consultationRepository.findById(id)
                .map(c -> {
                    c.setValidated(false);
                    c.setAdminComment(request.getOrDefault("comment", "Nu este corect"));
                    if (authentication != null) {
                        c.setValidatedBy(authentication.getName());
                    }
                    consultationRepository.save(c);
                    return ResponseEntity.ok(Map.of("message", "Consultația a fost marcată ca invalidă."));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Consultația nu a fost găsită")));
    }

    @GetMapping("/users")
    public List<String> getAllUserEmails() {
        return consultationRepository.findAll()
                .stream()
                .map(Consultation::getUserEmail)
                .distinct()
                .toList();
    }

    @GetMapping("/{id}/conversations")
    public ResponseEntity<?> getConsultationConversations(@PathVariable Long id) {
        return consultationRepository.findById(id)
                .map(consultation -> {
                    Optional<ChatSession> chatSession = chatSessionRepository.findById(consultation.getChatSession().getId());
                    if (chatSession.isPresent()) {
                        return ResponseEntity.ok(chatSession.get());
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("message", "Nu există conversații pentru acest animal."));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Consultația nu a fost găsită")));
    }
}