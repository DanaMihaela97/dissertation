package org.example.apianimals.service;

import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;

import java.util.List;

public interface AnimalService {
    AnimalInfoDto createAnimal(AnimalCreateDto createAnimalDto);
    List<AnimalInfoDto> getAnimals();

}
