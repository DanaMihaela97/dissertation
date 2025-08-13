package org.example.apianimals.service.impl;

import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineJoinDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.entity.AnimalVaccine;
import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.repository.AnimalVaccineRepository;
import org.example.apianimals.repository.VaccineRepository;
import org.example.apianimals.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import java.util.List;

@Service
public class VaccineServiceImpl implements VaccineService {

    private final VaccineRepository vaccineRepository;
    private final AnimalVaccineRepository animalVaccineRepository;
    private Sinks.Many<String> notifications = Sinks.many().multicast().onBackpressureBuffer();

    @Autowired
    public VaccineServiceImpl(VaccineRepository vaccineRepository,
                              AnimalVaccineRepository animalVaccineRepository) {
        this.vaccineRepository = vaccineRepository;
        this.animalVaccineRepository = animalVaccineRepository;
    }

    @Override
    public List<Vaccine> getVaccines() {
        return vaccineRepository.findAll();
    }

    @Override
    public Flux<String> getUpdates(String email) {
        List<AnimalVaccineJoinDto> animals = animalVaccineRepository.findAnimals(email);

        if (animals.isEmpty()) {
            return Flux.just("No updates.");
        }

        for (AnimalVaccineJoinDto animal : animals) {
            notifications.tryEmitNext(animal.getAnimalName() +
                    " trebuie sa-si faca rapel la vaccinul " +
                    animal.getVaccineName() + ".");
        }

        return notifications.asFlux();
    }
}
