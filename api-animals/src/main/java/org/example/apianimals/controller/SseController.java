package org.example.apianimals.controller;

import org.example.apianimals.repository.AnimalVaccineRepository;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;

@RestController
@RequestMapping("/websocket")
public class SseController {
    private final AnimalVaccineRepository animalVaccineRepository;
    public SseController(AnimalVaccineRepository animalVaccineRepository) {
        this.animalVaccineRepository = animalVaccineRepository;
    }

    @GetMapping("/updates")
    public Flux<ServerSentEvent<String>> streamEvents(@CookieValue(name = "email", required = false) String email) {
        if (email == null) {
            return Flux.empty();
        }

        Flux<String> notificationFlux = Mono.fromCallable(() -> animalVaccineRepository.findAnimalsByEmail(email))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMapMany(list -> {
                    if (list.isEmpty()) {
                        return Flux.empty();
                    }
                    return Flux.fromIterable(list)
                            .map(animal -> animal.getAnimalName() +
                                    " trebuie sa-si faca rapel la vaccinul " +
                                    animal.getVaccineName() +
                                    " pe data de " +
                                    animal.getFirstDoseDate().plusDays(animal.getRapelDays()));
                });
//        Flux<ServerSentEvent<String>> immediate = notificationFlux
//                .map(msg -> ServerSentEvent.<String>builder()
//                        .event("vaccine-update")
//                        .data(msg)
//                        .build());

        Flux<ServerSentEvent<String>> interval = Flux.interval(Duration.ofMinutes(1))
                .flatMap(tick -> notificationFlux)
                .map(msg -> ServerSentEvent.<String>builder()
                        .event("vaccine-update")
                        .data(msg)
                        .build());

        return Flux.concat(interval);
    }
}