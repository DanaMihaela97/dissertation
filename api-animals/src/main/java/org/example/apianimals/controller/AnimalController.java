package org.example.apianimals.controller;

import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.service.AnimalService;
import org.example.apianimals.service.AnimalVaccineService;
import org.example.apianimals.service.impl.AnimalServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    public ResponseEntity<AnimalInfoDto> createAnimal(@RequestBody AnimalCreateDto createAnimalDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = null;
        if (authentication != null && authentication.getCredentials() instanceof Jwt jwt) {
            email = jwt.getClaimAsString("email");
        }

        AnimalInfoDto createdAnimal = animalService.createAnimal(createAnimalDto, email);
        return ResponseEntity.ok(createdAnimal);
    }

    @GetMapping("/")
    public ResponseEntity<List<AnimalInfoDto>> getAllAnimals() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        List<AnimalInfoDto> animals = new ArrayList<>();
        if (authentication != null && authentication.getCredentials() instanceof Jwt jwt) {
            String email = jwt.getClaimAsString("email");
            animals = animalService.getAnimals(email);
        }
        return ResponseEntity.ok(animals);
    }

    @GetMapping("/{animalId}")
    public ResponseEntity<AnimalInfoDto> getAnimalById(@PathVariable Long animalId) {
        return ResponseEntity.ok(animalService.getAnimalById(animalId));
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

    @GetMapping("/count")
    public ResponseEntity<Integer> getAnimalCount() {
        return ResponseEntity.ok(animalService.animalCount());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editAnimal(@PathVariable Long id, @RequestBody AnimalInfoDto animalInfoDto){
        animalInfoDto.setId(id);
        animalService.editAnimal(animalInfoDto);
        return ResponseEntity.ok(animalInfoDto.toString());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        animalService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{animalId}/vaccines")
    public ResponseEntity<List<AnimalVaccineInfoDto>> updateAnimalVaccines(
            @PathVariable Long animalId,
            @RequestBody List<AnimalVaccineCreateDto> vaccineCreateDtos) {
        try {
            List<AnimalVaccineInfoDto> updatedVaccines = animalVaccineService.updateAnimalVaccines(animalId, vaccineCreateDtos);
            return ResponseEntity.ok(updatedVaccines);
        } catch (RuntimeException ex) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{animalId}/vaccines/{vaccineId}")
    public ResponseEntity<Void> deleteVaccineFromAnimal(
            @PathVariable Long animalId,
            @PathVariable Long vaccineId) {
        try {
            animalService.deleteVaccine(animalId, vaccineId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}