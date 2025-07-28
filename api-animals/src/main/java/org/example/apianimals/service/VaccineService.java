package org.example.apianimals.service;


import org.example.apianimals.entity.Vaccine;
import reactor.core.publisher.Flux;

import java.util.List;

public interface VaccineService {
    List<Vaccine> getVaccines();

    Flux<String> getUpdates(String email); // fct de returnat vaccinuri din perioada urm
}
