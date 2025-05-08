package org.example.service;

import org.example.dto.AnamnesisCreateDto;
import org.example.dto.AnamnesisResponseDto;

public interface AnamnesisService {
    AnamnesisResponseDto createAnamnesis(AnamnesisCreateDto dto);
}