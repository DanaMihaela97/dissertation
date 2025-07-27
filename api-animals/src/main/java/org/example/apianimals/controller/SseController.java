package org.example.apianimals.controller;

import org.example.apianimals.service.VaccineService;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
        AtomicInteger i = new AtomicInteger(0);
        return Flux.interval(Duration.ofSeconds(10))
//        return vaccineService.getUpdates()
              .map(productJson -> ServerSentEvent.<String>builder()
              .id(String.valueOf(i.addAndGet(1)))
              .event("vaccine-update")
              .data("vaccine " + i)
              .build());
    }
}