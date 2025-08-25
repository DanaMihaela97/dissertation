package org.example.apianimals.convertor;

import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.example.apianimals.entity.AnimalVaccine;

public class VaccineMapper {
    public static AnimalVaccineInfoDto mapToInfoDto(AnimalVaccine animalVaccine) {
        AnimalVaccineInfoDto dto = new AnimalVaccineInfoDto();
        dto.setAnimalId(animalVaccine.getAnimal().getId());
        dto.setVaccineId(animalVaccine.getVaccine().getId());
        dto.setFirstDoseDate(animalVaccine.getFirstDoseDate());
        dto.setSecondDoseDate(animalVaccine.getSecondDoseDate());

        return dto;
    }
}
