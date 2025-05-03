package org.example.apianimals.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.sql.Date;
import java.util.Objects;

@Embeddable
public class AnimalVaccineId implements Serializable {
    private Long animalId;
    private Long vaccineId;

    public AnimalVaccineId() {

    }

    public AnimalVaccineId(Long animalId, Long vaccineId, Date date) {
    }

    public Long getAnimalId() {
        return animalId;
    }

    public void setAnimalId(Long animalId) {
        this.animalId = animalId;
    }

    public Long getVaccineId() {
        return vaccineId;
    }

    public void setVaccineId(Long vaccineId) {
        this.vaccineId = vaccineId;
    }

    public AnimalVaccineId(Long animalId, Long vaccineId) {
        this.animalId = animalId;
        this.vaccineId = vaccineId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnimalVaccineId that = (AnimalVaccineId) o;
        return Objects.equals(animalId, that.animalId) && Objects.equals(vaccineId, that.vaccineId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(animalId, vaccineId);
    }
}
