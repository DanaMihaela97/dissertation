package org.example.apianimals.dto;

import java.util.List;

public class AnimalCreateDto {
    public String animalName;
    public String birthdate;
    public String sex;
    public int age;
    public String weight;
    public String type;
    public String breed;
    public String anamnesis;
    public List<VaccineCreateDto> vaccines;
}
