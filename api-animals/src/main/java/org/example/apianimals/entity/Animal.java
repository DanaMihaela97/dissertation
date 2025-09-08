package org.example.apianimals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
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
    @Column(name = "owner_email")
    private String ownerEmail;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AnimalVaccine> animalVaccines = new ArrayList<>();

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
                ", ownerEmail='" + ownerEmail + '\'' +
                ", animalVaccines=" + animalVaccines +
                '}';
    }
}
