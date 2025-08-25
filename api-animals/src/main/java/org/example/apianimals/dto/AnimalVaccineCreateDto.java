package org.example.apianimals.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AnimalVaccineCreateDto {
    private Long vaccineId;
    private LocalDate firstDoseDate;
    private LocalDate secondDoseDate;
    private Long animalId;
}
