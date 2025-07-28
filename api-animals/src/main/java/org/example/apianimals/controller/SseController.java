package org.example.apianimals.controller;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.example.apianimals.service.VaccineService;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/websocket")
public class SseController {

    private final VaccineService vaccineService;

    public SseController(VaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }
    @GetMapping("/updates")
    public Flux<ServerSentEvent<String>> streamEvents() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String email = null;

        if (authentication != null && authentication.getCredentials() instanceof Jwt jwt) {
            email = jwt.getClaimAsString("email");
        }

        if (email == null) {
            return Flux.empty();
        }

        String finalEmail = email;

        return Flux.interval(Duration.ofSeconds(10))
                .flatMap(tick -> vaccineService.getUpdates(finalEmail))
                .filter(msg -> !msg.equals("No updates."))
                .map(msg -> ServerSentEvent.<String>builder()
                        .event("vaccine-update")
                        .data(msg)
                        .build());
    }


}