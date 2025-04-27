package org.example.apianimals.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="vaccines")
public class Vaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "age_weeks", nullable = false)
    private int ageWeeks;

    @Column(name = "rapel", nullable = false)
    private String rapel;

    @Enumerated(EnumType.STRING)
    @Column(name = "animal_type", nullable = false)
    private AnimalType animalType;

    @ManyToMany(mappedBy = "vaccines")
    private List<Animal> animals = new ArrayList<>();

    public List<Animal> getAnimals() {
        return animals;
    }

    public void setAnimals(List<Animal> animals) {
        this.animals = animals;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAgeWeeks() {
        return ageWeeks;
    }

    public void setAgeWeeks(int ageWeeks) {
        this.ageWeeks = ageWeeks;
    }

    public String getRapel() {
        return rapel;
    }

    public void setRapel(String rapel) {
        this.rapel = rapel;
    }

    public AnimalType getAnimalType() {
        return animalType;
    }

    public void setAnimalType(AnimalType animalType) {
        this.animalType = animalType;
    }
}

