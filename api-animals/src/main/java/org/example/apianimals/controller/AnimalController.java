package org.example.apianimals.controller;

import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.service.AnimalService;
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
    private final VaccineService vaccineService;
    private final AnimalServiceImpl animalServiceImpl;

    @Autowired
    public AnimalController(AnimalService animalService, VaccineService vaccineService, AnimalServiceImpl animalServiceImpl) {
        this.animalService = animalService;
        this.vaccineService = vaccineService;
        this.animalServiceImpl = animalServiceImpl;
    }

    @PostMapping
    public ResponseEntity<AnimalInfoDto> createAnimal(@RequestBody AnimalCreateDto animalCreateDto) {
        AnimalInfoDto animalInfoDto = animalService.createAnimal(animalCreateDto);
        return ResponseEntity.ok(animalInfoDto);
    }

    @GetMapping("/")
    public ResponseEntity<List<AnimalInfoDto>> getAllAnimals() {
        List<AnimalInfoDto> animals = animalService.getAnimals();
        return ResponseEntity.ok(animals);
    }

    @GetMapping("/vaccines")
    public ResponseEntity<List<Vaccine>> getAllVaccines() {
        return ResponseEntity.ok(vaccineService.getVaccines());
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