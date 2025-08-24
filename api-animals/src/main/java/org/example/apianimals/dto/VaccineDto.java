package org.example.apianimals.dto;

import lombok.Data;

@Data
public class VaccineDto {
   private Long id;
   private String name;
   private int ageWeeks;
   private int rapel_days;
   private String revaccinationInterval;
   private String animalType;
}
