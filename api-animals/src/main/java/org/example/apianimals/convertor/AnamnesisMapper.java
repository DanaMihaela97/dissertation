package org.example.apianimals.convertor;

import org.example.apianimals.dto.AnamnesisCreateDto;
import org.example.apianimals.dto.AnamnesisInfoDto;
import org.example.apianimals.entity.Anamnesis;
import org.example.apianimals.entity.Animal;

public class AnamnesisMapper {

    public static Anamnesis toEntity(AnamnesisCreateDto dto, Animal animal){
    Anamnesis anamnesis = new Anamnesis();
    anamnesis.setAddress(dto.getAddress());
    anamnesis.setAnamnesis(dto.getAnamnesis());
    anamnesis.setAnimal(animal);

        return anamnesis;
    }

    public static AnamnesisInfoDto toDto (Anamnesis anamnesis){
        AnamnesisInfoDto dto = new AnamnesisInfoDto();
        dto.setAddress(anamnesis.getAddress());
        dto.setAnimalId(anamnesis.getAnimal().getId());

        return dto;
    }
}
