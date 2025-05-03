package org.example.apianimals.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnamnesisCreateDto {
    private String anamnesis;
    private String address;
    private Long animalId;
}
