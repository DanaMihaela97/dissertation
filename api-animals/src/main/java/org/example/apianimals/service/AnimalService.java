package org.example.apianimals.service;

import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;

import java.util.List;

public interface AnimalService {
    AnimalInfoDto createAnimal(AnimalCreateDto createAnimalDto, String email);
    List<AnimalInfoDto> getAnimals(String email);
    AnimalInfoDto getAnimalById(Long id);
    int animalCount();

}
