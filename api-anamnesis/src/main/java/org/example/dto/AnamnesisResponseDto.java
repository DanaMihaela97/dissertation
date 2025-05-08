package org.example.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class AnamnesisResponseDto {
    private Long id;
    private String anamnesis;
    private String address;
    private AnimalDto animal;
    private List<VaccineDto> vaccines;

}
