package org.example.apianimals.controller;

import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.service.AnimalService;
import org.example.apianimals.service.AnimalVaccineService;
import org.example.apianimals.service.VaccineService;
import org.example.apianimals.service.impl.AnimalServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {
    private final AnimalService animalService;
    private final AnimalServiceImpl animalServiceImpl;
    private final AnimalVaccineService animalVaccineService;

    @Autowired
    public AnimalController(AnimalService animalService, AnimalServiceImpl animalServiceImpl, AnimalVaccineService animalVaccineService) {
        this.animalService = animalService;
        this.animalServiceImpl = animalServiceImpl;
        this.animalVaccineService = animalVaccineService;
    }

    @PostMapping("/")
    public ResponseEntity<AnimalInfoDto> createAnimal(@RequestBody AnimalCreateDto animalCreateDto) {
        AnimalInfoDto animalInfoDto = animalService.createAnimal(animalCreateDto);
        return ResponseEntity.ok(animalInfoDto);
    }

    @GetMapping("/")
    public ResponseEntity<List<AnimalInfoDto>> getAllAnimals() {
        List<AnimalInfoDto> animals = animalService.getAnimals();
        return ResponseEntity.ok(animals);
    }

    @PostMapping("/{animalId}/vaccines")
    public ResponseEntity<List<AnimalVaccineInfoDto>> addVaccinesToAnimal(@PathVariable Long animalId,
                                                                          @RequestBody List<AnimalVaccineCreateDto> vaccineCreateDtos) {

        List<AnimalVaccineInfoDto> vaccineInfoDtos = animalVaccineService.createAnimalVaccine(animalId, vaccineCreateDtos);

        return ResponseEntity.ok(vaccineInfoDtos);
    }

    @GetMapping("/{animalId}/vaccines")
    public ResponseEntity<List<AnimalVaccineInfoDto>> getVaccinesForAnimal(@PathVariable Long animalId) {
        List<AnimalVaccineInfoDto> vaccineDtos = animalVaccineService.getAnimalVaccine(animalId);
        return ResponseEntity.ok(vaccineDtos);
    }
    @GetMapping("/dog-breeds")
    public ResponseEntity<List<String>> getDogBreeds() {
        List<String> dogBreeds=animalServiceImpl.getDogBreeds();
        return ResponseEntity.ok(dogBreeds);
    }

    @GetMapping("/cat-breeds")
    public ResponseEntity<List<String>> getCatBreeds() {
        List<String> catBreeds=animalServiceImpl.getCatBreeds();
        return ResponseEntity.ok(catBreeds);
    }
}