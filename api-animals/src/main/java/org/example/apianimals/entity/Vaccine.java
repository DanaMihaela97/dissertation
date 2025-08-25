package org.example.apianimals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

    @Column(name = "rapel_days", nullable = false)
    private int rapelDays;

    @Column(name = "revaccination_interval", nullable = false)
    private String revaccinationInterval;

    @Enumerated(EnumType.STRING)
    @Column(name = "animal_type", nullable = false)
    private AnimalType animalType;
}

