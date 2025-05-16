package org.example.apichat.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Animal {
    private Long id;
    private String animalName;
    private String birthdate;
    private String sex;
    private int age;
    private String weight;
    private String type;
    private String breed;
    private String anamnesis;
    private List<Vaccine> vaccines;

}
