package org.example.apichat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class Animal {
    public String animalName;
    public String birthdate;
    public String sex;
    public int age;
    public String weight;
    public String type;
    public String breed;
    public String anamnesis;
    public List<Vaccine> vaccines;

}
