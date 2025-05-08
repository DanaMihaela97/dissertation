package org.example.service.impl;

import org.example.dto.AnamnesisCreateDto;
import org.example.dto.AnamnesisResponseDto;
import org.example.dto.AnimalDto;
import org.example.dto.VaccineDto;
import org.example.entity.Anamnesis;
import org.example.repository.AnamnesisRepository;
import org.example.service.AnamnesisService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnamnesisServiceImpl implements AnamnesisService {

    private final AnamnesisRepository anamnesisRepository;
    private final AnimalClientService animalClientService;

    public AnamnesisServiceImpl(AnamnesisRepository anamnesisRepository,
                                AnimalClientService animalClientService) {
        this.anamnesisRepository = anamnesisRepository;
        this.animalClientService = animalClientService;
    }

    @Override
    public AnamnesisResponseDto createAnamnesis(AnamnesisCreateDto dto) {
        AnimalDto animalDto = animalClientService.getAnimalById(dto.getAnimalId());
        if (animalDto == null) {
            throw new RuntimeException("Animalul nu a fost găsit.");
        }

        Anamnesis anamnesis = new Anamnesis();
        anamnesis.setAnamnesis(dto.getAnamnesis());
        anamnesis.setAddress(dto.getAddress());
        anamnesis.setAnimalId(dto.getAnimalId());

        Anamnesis saved = anamnesisRepository.save(anamnesis);

        List<VaccineDto> vaccines = animalClientService.getVaccinesForAnimal(dto.getAnimalId());

        AnamnesisResponseDto responseDto = new AnamnesisResponseDto();
        responseDto.setId(saved.getId());
        responseDto.setAnamnesis(saved.getAnamnesis());
        responseDto.setAddress(saved.getAddress());
        responseDto.setAnimal(animalDto);
        responseDto.setVaccines(vaccines);

        return responseDto;
    }
}
