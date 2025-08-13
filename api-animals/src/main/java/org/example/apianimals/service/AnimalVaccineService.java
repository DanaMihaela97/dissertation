package org.example.apianimals.service;

import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.entity.AnimalVaccine;

import java.util.List;

public interface AnimalVaccineService {
    List<AnimalVaccineInfoDto> createAnimalVaccine(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos);
    List<AnimalVaccineInfoDto> getAnimalVaccine(Long animalId);
    List<AnimalVaccineInfoDto> updateAnimalVaccines(Long animalId, List<AnimalVaccineCreateDto> vaccineCreateDtos);

}
