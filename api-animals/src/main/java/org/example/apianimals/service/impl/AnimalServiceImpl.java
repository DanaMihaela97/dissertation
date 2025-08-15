package org.example.apianimals.service.impl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.example.apianimals.convertor.AnimalMapper;
import org.example.apianimals.convertor.VaccineMapper;
import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.entity.AnimalVaccine;
import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.repository.AnimalRepository;
import org.example.apianimals.repository.AnimalVaccineRepository;
import org.example.apianimals.repository.VaccineRepository;
import org.example.apianimals.service.AnimalService;
import org.example.apianimals.service.AnimalVaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnimalServiceImpl implements AnimalService, AnimalVaccineService {

    private final AnimalRepository animalRepository;
    private final RestTemplate restTemplate;
    private final VaccineRepository vaccineRepository;
    private final AnimalVaccineRepository animalVaccineRepository;

    @Value("${dog.api.key}")
    private String dogApiKey;

    @Value("${cat.api.key}")
    private String catApiKey;

    @Autowired
    public AnimalServiceImpl(AnimalRepository animalRepository, RestTemplate restTemplate,
                             VaccineRepository vaccineRepository, AnimalVaccineRepository animalVaccineRepository) {
        this.animalRepository = animalRepository;
        this.restTemplate = restTemplate;
        this.vaccineRepository = vaccineRepository;
        this.animalVaccineRepository = animalVaccineRepository;
    }

    // External API calls — no transactions
    public List<String> getDogBreeds() {
        String url = "https://api.thedogapi.com/v1/breeds";
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", dogApiKey);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

        return ((List<Map<String, Object>>) response.getBody()).stream()
                .map(breed -> (String) breed.get("name"))
                .collect(Collectors.toList());
    }

    public List<String> getCatBreeds() {
        String url = "https://api.thecatapi.com/v1/breeds";
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", catApiKey);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

        return ((List<Map<String, Object>>) response.getBody()).stream()
                .map(breed -> (String) breed.get("name"))
                .collect(Collectors.toList());
    }

    // Read-only methods
    @Override
    @Transactional(readOnly = true)
    public List<AnimalInfoDto> getAnimals(String email) {
        List<Animal> animals = animalRepository.findAnimalsByEmail(email);
        return animals.stream().map(AnimalMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AnimalInfoDto getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + id));
        return AnimalMapper.toDto(animal);
    }

    // Modifying data — transactional
    @Override
    @Transactional
    public AnimalInfoDto createAnimal(AnimalCreateDto createAnimalDto, String email) {
        Animal animal = AnimalMapper.toEntity(createAnimalDto, email);
        animal.setEmail(email);

        animal = animalRepository.save(animal);
        final Animal finalAnimal = animal;

        if (createAnimalDto.getVaccines() != null && !createAnimalDto.getVaccines().isEmpty()) {
            List<AnimalVaccine> animalVaccines = createAnimalDto.getVaccines().stream()
                    .map(dto -> {
                        AnimalVaccine av = new AnimalVaccine();
                        av.setAnimal(finalAnimal);
                        av.setVaccine(vaccineRepository.getVaccinesById(dto.getVaccineId()));
                        av.setDateAdministered(dto.getDateAdministered());
                        return av;
                    })
                    .collect(Collectors.toList());

            animalVaccineRepository.saveAll(animalVaccines);
            finalAnimal.setAnimalVaccines(animalVaccines);
        }

        return AnimalMapper.toDto(animalRepository.save(finalAnimal));
    }

    @Override
    @Transactional
    public List<AnimalVaccineInfoDto> createAnimalVaccine(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        List<AnimalVaccine> newVaccines = vaccineCreateDtos.stream().map(dto -> {
            Vaccine vaccine = vaccineRepository.findById(dto.getVaccineId())
                    .orElseThrow(() -> new RuntimeException("Vaccine not found"));
            AnimalVaccine av = new AnimalVaccine();
            av.setAnimal(animal);
            av.setVaccine(vaccine);
            av.setDateAdministered(dto.getDateAdministered());
            return av;
        }).toList();

        animalVaccineRepository.saveAll(newVaccines);

        return newVaccines.stream().map(VaccineMapper::mapToInfoDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnimalVaccineInfoDto> getAnimalVaccine(Long animalId) {
        List<AnimalVaccine> animalVaccines = animalVaccineRepository.findByAnimalId(animalId);
        return animalVaccines.stream().map(VaccineMapper::mapToInfoDto).toList();
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

            if (existing.isPresent()) {
                AnimalVaccine av = existing.get();
                av.setDateAdministered(dto.getDateAdministered());
                savedVaccines.add(av);
            } else {
                AnimalVaccine av = new AnimalVaccine();
                av.setAnimal(animal);
                av.setVaccine(vaccine);
                av.setDateAdministered(dto.getDateAdministered());
                savedVaccines.add(av);
            }
        }

        animalVaccineRepository.saveAll(savedVaccines);
        return savedVaccines.stream().map(VaccineMapper::mapToInfoDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public int animalCount() {
        return (int) animalRepository.count();
    }

    @Override
    @Transactional
    public void editAnimal(AnimalInfoDto animalInfoDto) {
        Animal animal = animalRepository.findById(animalInfoDto.getId())
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        animal.setAnimalName(animalInfoDto.getAnimalName());
        animal.setBirthdate(LocalDate.parse(animalInfoDto.getBirthdate()));
        animal.setSex(animalInfoDto.getSex());
        animal.setAge(animalInfoDto.getAge());
        animal.setWeight(animalInfoDto.getWeight());
        animal.setType(animalInfoDto.getType());
        animal.setBreed(animalInfoDto.getBreed());

        animalRepository.save(animal);
    }

    @Override
    @Transactional
    public void deleteAnimal(Long id) {
        animalRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteVaccine(Long animalId, Long vaccineId) {
        animalVaccineRepository.deleteByAnimalIdAndVaccineId(animalId, vaccineId);
    }
}
