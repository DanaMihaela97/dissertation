package org.example.apianimals.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AnimalVaccineJoinDto {
    private Long animalId;
    private String animalName;
    private Long vaccineId;
    private LocalDate dateAdministered;
    private String vaccineName;
}