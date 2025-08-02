package org.example.apianimals.dto;

import lombok.AllArgsConstructor;
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

    public AnimalVaccineJoinDto(Long animalId, String animalName, Long vaccineId, java.sql.Date dateAdministered, String vaccineName) {
        this.animalId = animalId;
        this.animalName = animalName;
        this.vaccineId = vaccineId;
        this.dateAdministered = dateAdministered.toLocalDate();
        this.vaccineName = vaccineName;
    }
}
