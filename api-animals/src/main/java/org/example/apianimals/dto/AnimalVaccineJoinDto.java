package org.example.apianimals.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AnimalVaccineJoinDto {
    private Long animalId;
    private String animalName;
    private Long vaccineId;
    private LocalDate firstDoseDate;
    private LocalDate secondDoseDate;
    private String vaccineName;
    private Integer rapelDays;
}
