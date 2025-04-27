package org.example.apianimals.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Entity
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
    private String anamnesis;
    @ManyToMany
    @JoinTable(
            name = "animal_vaccines",
            joinColumns = @JoinColumn(name = "animal_id"),
            inverseJoinColumns = @JoinColumn(name = "vaccine_id")
    )
    private List<Vaccine> vaccines = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnimalName() {
        return animalName;
    }

    public void setAnimalName(String animalName) {
        this.animalName = animalName;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getAnamnesis() {
        return anamnesis;
    }

    public void setAnamnesis(String anamnesis) {
        this.anamnesis = anamnesis;
    }

    public List<Vaccine> getVaccines() {
        return vaccines;
    }

    public void setVaccines(List<Vaccine> vaccines) {
        this.vaccines = vaccines;
    }

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
                ", birthdate='" + birthdate + '\'' +
                ", sex='" + sex + '\'' +
                ", age=" + age +
                ", weight='" + weight + '\'' +
                ", type='" + type + '\'' +
                ", breed='" + breed + '\'' +
                ", anamnesis='" + anamnesis + '\'' +
                ", vaccines=" + vaccines +
                '}';
    }
}
