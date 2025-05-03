package org.example.apianimals.service.impl;

import jakarta.persistence.EntityNotFoundException;
import org.example.apianimals.convertor.AnamnesisMapper;
import org.example.apianimals.dto.AnamnesisCreateDto;
import org.example.apianimals.dto.AnamnesisInfoDto;
import org.example.apianimals.entity.Anamnesis;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.repository.AnamnesisRepository;
import org.example.apianimals.repository.AnimalRepository;
import org.example.apianimals.service.AnamnesisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnamnesisServiceImpl implements AnamnesisService {

    private final AnamnesisRepository anamnesisRepository;
    private final AnimalRepository animalRepository;

    @Autowired
    public AnamnesisServiceImpl(AnamnesisRepository anamnesisRepository, AnimalRepository animalRepository) {
        this.anamnesisRepository = anamnesisRepository;
        this.animalRepository = animalRepository;
    }

    @Override
    public AnamnesisInfoDto createAnamnesis(AnamnesisCreateDto dto) {
        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new EntityNotFoundException("Animal not found with ID: " + dto.getAnimalId()));

        Anamnesis anamnesis = AnamnesisMapper.toEntity(dto, animal);
        Anamnesis saved = anamnesisRepository.save(anamnesis);

        return AnamnesisMapper.toDto(saved);
    }
}
