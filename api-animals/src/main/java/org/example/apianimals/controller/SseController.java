package org.example.apianimals.controller;
import org.example.apianimals.service.VaccineService;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

@RestController
@RequestMapping("/websocket")
public class SseController {

    private final VaccineService vaccineService;

    public SseController(VaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }

    @GetMapping("/updates")
    public Flux<ServerSentEvent<String>> streamEvents(@CookieValue(name = "email", required = false) String email) {
        if (email == null) {
            return Flux.empty();
        }

        String finalEmail = email;

        Flux<ServerSentEvent<String>> initialNotification = vaccineService.getUpdates(finalEmail)
                .filter(msg -> !msg.equals("No updates."))
                .map(msg -> ServerSentEvent.<String>builder()
                        .event("vaccine-update")
                        .data(msg)
                        .build());

        Flux<ServerSentEvent<String>> periodicNotifications = Flux.interval(Duration.ofMinutes(1))
                .flatMap(tick -> vaccineService.getUpdates(finalEmail))
                .filter(msg -> !msg.equals("No updates."))
                .map(msg -> ServerSentEvent.<String>builder()
                        .event("vaccine-update")
                        .data(msg)
                        .build());

        return Flux.merge(initialNotification, periodicNotifications);
    }
}