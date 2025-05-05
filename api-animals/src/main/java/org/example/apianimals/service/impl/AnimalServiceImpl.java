package org.example.apianimals.service.impl;

import jakarta.transaction.Transactional;
import org.example.apianimals.convertor.AnimalMapper;
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
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnimalServiceImpl implements AnimalService, AnimalVaccineService {
    private final AnimalRepository animalRepository;
    @Value("${dog.api.key}")
    private String dogApiKey;

    @Value("${cat.api.key}")
    private String catApiKey;
    private final RestTemplate restTemplate;
    private final VaccineRepository vaccineRepository;
    private final AnimalVaccineRepository animalVaccineRepository;

    @Autowired
    public AnimalServiceImpl(AnimalRepository animalRepository, RestTemplate restTemplate, VaccineRepository vaccineRepository, AnimalVaccineRepository animalVaccineRepository) {
        this.animalRepository = animalRepository;
        this.restTemplate = restTemplate;
        this.vaccineRepository = vaccineRepository;
        this.animalVaccineRepository = animalVaccineRepository;
    }

    public List<String> getDogBreeds() {
        String url = "https://api.thedogapi.com/v1/breeds?api_key=" + dogApiKey;
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, null, List.class);

        return ((List<Map<String, Object>>) response.getBody()).stream()
                .map(breed -> (String) breed.get("name"))
                .collect(Collectors.toList());
    }

    public List<String> getCatBreeds() {
        String url = "https://api.thecatapi.com/v1/breeds?api_key=" + catApiKey;
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, null, List.class);

        return ((List<Map<String, Object>>) response.getBody()).stream()
                .map(breed -> (String) breed.get("name"))
                .collect(Collectors.toList());
    }

    @Override
    public AnimalInfoDto createAnimal(AnimalCreateDto createAnimalDto) {
        Animal animal = AnimalMapper.toEntity(createAnimalDto);
        animal = animalRepository.save(animal);
        List<AnimalVaccine> animalVaccines = new ArrayList<>();
        if (createAnimalDto.getVaccines() != null) {
            for (AnimalVaccineCreateDto animalVaccineCreateDto : createAnimalDto.vaccines) {
                AnimalVaccine animalVaccine = new AnimalVaccine();
                animalVaccine.setDateAdministered(animalVaccineCreateDto.getDateAdministered());
                animalVaccine.setAnimal(animal);
                Vaccine vaccine = vaccineRepository.getVaccinesById(animalVaccineCreateDto.getVaccineId());
                animalVaccine.setVaccine(vaccine);
                animalVaccines.add(animalVaccineRepository.save(animalVaccine));
            }
        }
        animal.setAnimalVaccines(animalVaccines);
        animal = animalRepository.save(animal);
        return AnimalMapper.toDto(animal);
    }

    @Override
    public List<AnimalInfoDto> getAnimals() {
        List<Animal> animals = animalRepository.findAll();

        return animals.stream()
                .map(AnimalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnimalVaccineInfoDto> createAnimalVaccine(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos) {
        List<AnimalVaccineInfoDto> vaccineInfoDtos = new ArrayList<>();

        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        for (AnimalVaccineCreateDto vaccineDto : vaccineCreateDtos) {
            Vaccine vaccine = vaccineRepository.findById(vaccineDto.getVaccineId())
                    .orElseThrow(() -> new RuntimeException("Vaccine not found"));

            AnimalVaccine animalVaccine = new AnimalVaccine();
            animalVaccine.setAnimal(animal);
            animalVaccine.setVaccine(vaccine);
            animalVaccine.setDateAdministered(vaccineDto.getDateAdministered());

            animalVaccineRepository.save(animalVaccine);
            animalRepository.save(animal);

            AnimalVaccineInfoDto result = new AnimalVaccineInfoDto();
            result.setAnimalId(animalVaccine.getAnimal().getId());
            result.setVaccineId(animalVaccine.getVaccine().getId());
            result.setDateAdministered(animalVaccine.getDateAdministered());

            vaccineInfoDtos.add(result);
        }
        return vaccineInfoDtos;
    }


    @Override
    public List<AnimalVaccineInfoDto> getAnimalVaccine(Long animalId) {
        List<AnimalVaccine> animalVaccines = animalVaccineRepository.findByAnimalId(animalId);

        return animalVaccines.stream()
                .map(animalVaccine -> {
                    AnimalVaccineInfoDto dto = new AnimalVaccineInfoDto();
                    dto.setAnimalId(animalVaccine.getAnimal().getId());
                    dto.setVaccineId(animalVaccine.getVaccine().getId());
                    dto.setDateAdministered(animalVaccine.getDateAdministered());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
