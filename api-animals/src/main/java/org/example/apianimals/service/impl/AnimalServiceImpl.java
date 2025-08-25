package org.example.apianimals.service.impl;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.example.apianimals.convertor.AnimalMapper;
import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.entity.AnimalVaccine;
import org.example.apianimals.repository.AnimalRepository;
import org.example.apianimals.repository.AnimalVaccineRepository;
import org.example.apianimals.repository.VaccineRepository;
import org.example.apianimals.service.AnimalService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnimalServiceImpl implements AnimalService {

    private final AnimalRepository animalRepository;
    private final RestTemplate restTemplate;
    private final VaccineRepository vaccineRepository;
    private final AnimalVaccineRepository animalVaccineRepository;

    @Value("${dog.api.key}")
    private String dogApiKey;

    @Value("${cat.api.key}")
    private String catApiKey;

    @Autowired
    public AnimalServiceImpl(RestTemplate restTemplate,
                             AnimalRepository animalRepository,
                             VaccineRepository vaccineRepository,
                             AnimalVaccineRepository animalVaccineRepository) {
        this.animalRepository = animalRepository;
        this.restTemplate = restTemplate;
        this.vaccineRepository = vaccineRepository;
        this.animalVaccineRepository = animalVaccineRepository;
    }

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

    @Override
    @Transactional(readOnly = true)
    public List<AnimalInfoDto> getAnimals(String email) {
        List<Animal> animals = animalRepository.findAnimalsByOwnerEmail(email);
        return animals.stream().map(AnimalMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AnimalInfoDto getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with id: " + id));
        return AnimalMapper.toDto(animal);
    }

    @Override
    @Transactional
    public AnimalInfoDto createAnimal(AnimalCreateDto createAnimalDto, String email) {
        Animal animal = AnimalMapper.toEntity(createAnimalDto, email);
        animal.setOwnerEmail(email);

        animal = animalRepository.save(animal);
        final Animal finalAnimal = animal;

        if (createAnimalDto.getVaccines() != null && !createAnimalDto.getVaccines().isEmpty()) {
            List<AnimalVaccine> animalVaccines = createAnimalDto.getVaccines().stream()
                    .map(dto -> {
                        AnimalVaccine av = new AnimalVaccine();
                        av.setAnimal(finalAnimal);
                        av.setVaccine(vaccineRepository.getVaccinesById(dto.getVaccineId()));
                        av.setFirstDoseDate(dto.getFirstDoseDate());
                        av.setSecondDoseDate(dto.getSecondDoseDate());
                        return av;
                    })
                    .collect(Collectors.toList());

            animalVaccineRepository.saveAll(animalVaccines);
            finalAnimal.setAnimalVaccines(animalVaccines);
        }

        return AnimalMapper.toDto(animalRepository.save(finalAnimal));
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
