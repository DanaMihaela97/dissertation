package org.example.apianimals.service.impl;

import jakarta.transaction.Transactional;
import org.example.apianimals.convertor.AnimalMapper;
import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.repository.AnimalRepository;
import org.example.apianimals.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnimalServiceImpl implements AnimalService {
    private final AnimalRepository animalRepository;
    @Value("${dog.api.key}")
    private String dogApiKey;

    @Value("${cat.api.key}")
    private String catApiKey;
    private final RestTemplate restTemplate;

    @Autowired
    public AnimalServiceImpl(AnimalRepository animalRepository, RestTemplate restTemplate) {
        this.animalRepository = animalRepository;
        this.restTemplate = restTemplate;
    }

//    @Override
//    public Animal createAnimalProfile(Animal animal) {
//        return animalRepository.save(animal);
//    }
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
        try {
            Animal animal = AnimalMapper.toEntity(createAnimalDto);
            Animal savedAnimal = animalRepository.save(animal);
            return AnimalMapper.toDto(savedAnimal);
        } catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Eroare la salvarea animalului.");
        }
    }

    @Override
    public List<AnimalInfoDto> getAnimals() {
        List<Animal> animals = animalRepository.findAll();

        return animals.stream()
                .map(AnimalMapper::toDto)
                .collect(Collectors.toList());
    }
}
