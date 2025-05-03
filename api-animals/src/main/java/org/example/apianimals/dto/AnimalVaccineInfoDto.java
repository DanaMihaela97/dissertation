package org.example.apianimals.dto;

import java.time.LocalDate;

public class AnimalVaccineInfoDto {
    private Long vaccineId;
    private LocalDate dateAdministered;
    private Long animalId;


    public Long getAnimalId() {
        return animalId;
    }

    public void setAnimalId(Long animalId) {
        this.animalId = animalId;
    }

    // Getters și Setters
    public Long getVaccineId() {
        return vaccineId;
    }

    public void setVaccineId(Long vaccineId) {
        this.vaccineId = vaccineId;
    }

    public LocalDate getDateAdministered() {
        return dateAdministered;
    }

    public void setDateAdministered(LocalDate dateAdministered) {
        this.dateAdministered = dateAdministered;
    }
}