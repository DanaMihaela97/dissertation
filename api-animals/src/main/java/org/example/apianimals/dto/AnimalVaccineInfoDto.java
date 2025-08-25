package org.example.apianimals.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnimalVaccineInfoDto {

    private Long vaccineId;
    private LocalDate firstDoseDate;
    private LocalDate secondDoseDate;
    private Long animalId;
}