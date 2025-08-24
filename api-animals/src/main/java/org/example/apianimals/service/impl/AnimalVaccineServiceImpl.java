package org.example.apianimals.service.impl;

import org.example.apianimals.convertor.AnimalVaccineInfoMapper;
import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.entity.AnimalVaccine;
import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.repository.AnimalRepository;
import org.example.apianimals.repository.AnimalVaccineRepository;
import org.example.apianimals.repository.VaccineRepository;
import org.example.apianimals.service.AnimalVaccineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnimalVaccineServiceImpl implements AnimalVaccineService {

    private final AnimalRepository animalRepository;
    private final AnimalVaccineRepository animalVaccineRepository;
    private final VaccineRepository vaccineRepository;

    public AnimalVaccineServiceImpl(AnimalRepository animalRepository,
                                    AnimalVaccineRepository animalVaccineRepository,
                                    VaccineRepository vaccineRepository) {
        this.animalRepository = animalRepository;
        this.animalVaccineRepository = animalVaccineRepository;
        this.vaccineRepository = vaccineRepository;
    }

    @Override
    @Transactional
    public List<AnimalVaccineInfoDto> createAnimalVaccine(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        List<AnimalVaccine> newVaccines = vaccineCreateDtos.stream()
                .map(dto -> {
                    Vaccine vaccine = vaccineRepository.findById(dto.getVaccineId())
                            .orElseThrow(() -> new RuntimeException("Vaccine not found"));
                    AnimalVaccine av = new AnimalVaccine();
                    av.setAnimal(animal);
                    av.setVaccine(vaccine);
                    av.setDateAdministered(dto.getDateAdministered());
                    return av;
                })
                .collect(Collectors.toList());

        animalVaccineRepository.saveAll(newVaccines);
        return newVaccines.stream().map(AnimalVaccineInfoMapper::mapToInfoDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnimalVaccineInfoDto> getAnimalVaccine(Long animalId) {
        List<AnimalVaccine> animalVaccines = animalVaccineRepository.findByAnimalId(animalId);
        return animalVaccines.stream().map(AnimalVaccineInfoMapper::mapToInfoDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AnimalVaccineInfoDto> updateAnimalVaccines(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        List<AnimalVaccine> savedVaccines = new ArrayList<>();

        for (AnimalVaccineCreateDto dto : vaccineCreateDtos) {
            Vaccine vaccine = vaccineRepository.findById(dto.getVaccineId())
                    .orElseThrow(() -> new RuntimeException("Vaccine not found"));

            Optional<AnimalVaccine> existing = animalVaccineRepository.findByAnimalIdAndVaccineId(animalId, dto.getVaccineId());

            AnimalVaccine av = existing.orElseGet(AnimalVaccine::new);
            av.setAnimal(animal);
            av.setVaccine(vaccine);
            av.setDateAdministered(dto.getDateAdministered());

            savedVaccines.add(av);
        }

        animalVaccineRepository.saveAll(savedVaccines);
        return savedVaccines.stream().map(AnimalVaccineInfoMapper::mapToInfoDto).collect(Collectors.toList());
    }
}