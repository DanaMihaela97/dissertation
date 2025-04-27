package org.example.apianimals.dto;

import java.util.List;

public class AnimalInfoDto {
    public String animalName;
    public String birthdate;
    public String sex;
    public int age;
    public String weight;
    public String type;
    public String breed;
    public String anamnesis;
    public List<VaccineInfoDto> vaccines; // Modificat din VaccineCreateDto în VaccineInfoDto
}