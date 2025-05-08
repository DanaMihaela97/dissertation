package org.example.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AnimalDto {
    public Long id;
    public String animalName;
    public String birthdate;
    public String sex;
    public int age;
    public String weight;
    public String type;
    public String breed;
    List<VaccineDto> vaccines;
}
