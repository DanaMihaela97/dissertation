package org.example.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class VaccineDto {
    private Long vaccineId;
    private LocalDate dateAdministered;
    private Long animalId;

}
