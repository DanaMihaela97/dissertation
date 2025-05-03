package org.example.apianimals.service;

import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;

import java.util.List;

public interface AnimalVaccineService {
    List<AnimalVaccineInfoDto> createAnimalVaccine(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos);
    List<AnimalVaccineInfoDto> getAnimalVaccine(Long animalId);

}
