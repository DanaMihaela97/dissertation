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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vaccine_id")
    private Vaccine vaccine;

    @Column(name = "date_administered")
    private LocalDate dateAdministered;


    public LocalDate getNextVaccinationDate() {
        if (vaccine == null || dateAdministered == null) {
            return null;
        }
        return dateAdministered.plusDays(vaccine.getRapel_days());
    }

}
