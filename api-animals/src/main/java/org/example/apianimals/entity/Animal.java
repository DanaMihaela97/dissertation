package org.example.apianimals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name="animal")
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "animal_name")
    private String animalName;
    @Column(name = "birthdate")
    private LocalDate birthdate;
    private String sex;
    private int age;
    private String weight;
    private String type;
    private String breed;
    private String email;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AnimalVaccine> animalVaccines = new ArrayList<>();

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    private List<Anamnesis> anamneses = new ArrayList<>();

    private int calculateAge(String birthDate) {
        if (birthDate == null || birthDate.isEmpty()) {
            return 0;
        }

        try {
            LocalDate birthDDate = LocalDate.parse(birthDate);
            LocalDate currentDate = LocalDate.now();
            Period period = Period.between(birthDDate, currentDate);
            return period.getYears();
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public String toString() {
        return "Animal{" +
                "id=" + id +
                ", animalName='" + animalName + '\'' +
                ", birthdate=" + birthdate +
                ", sex='" + sex + '\'' +
                ", age=" + age +
                ", weight='" + weight + '\'' +
                ", type='" + type + '\'' +
                ", breed='" + breed + '\'' +
                ", email='" + email + '\'' +
                ", animalVaccines=" + animalVaccines +
                ", anamneses=" + anamneses +
                '}';
    }
}
