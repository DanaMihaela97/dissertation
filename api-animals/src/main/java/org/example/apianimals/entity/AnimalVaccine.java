package org.example.apianimals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "animal_vaccines")
public class AnimalVaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne
    @JoinColumn
    private Vaccine vaccine;

    @Column(name = "first_dose_date")
    private LocalDate firstDoseDate;

    @Column(name = "second_dose_date")
    private LocalDate secondDoseDate;


}
