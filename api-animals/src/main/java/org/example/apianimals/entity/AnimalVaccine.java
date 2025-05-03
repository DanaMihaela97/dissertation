package org.example.apianimals.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "animal_vaccines")
public class AnimalVaccine {
    @EmbeddedId
    private AnimalVaccineId id;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("animalId")
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("vaccineId")
    @JoinColumn(name = "vaccine_id")
    private Vaccine vaccine;

    @Column(name = "date_administered")
    private LocalDate dateAdministered;

    public AnimalVaccineId getId() {
        return id;
    }

    public void setId(AnimalVaccineId id) {
        this.id = id;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public Vaccine getVaccine() {
        return vaccine;
    }

    public void setVaccine(Vaccine vaccine) {
        this.vaccine = vaccine;
    }

    public LocalDate getDateAdministered() {
        return dateAdministered;
    }

    public void setDateAdministered(LocalDate dateAdministered) {
        this.dateAdministered = dateAdministered;
    }
}
