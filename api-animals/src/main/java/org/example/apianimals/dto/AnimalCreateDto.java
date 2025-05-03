package org.example.apianimals.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AnimalCreateDto {
    public Long id;
    public String animalName;
    public String birthdate;
    public String sex;
    public int age;
    public String weight;
    public String type;
    public String breed;
    public List<AnimalVaccineCreateDto> vaccines;
}