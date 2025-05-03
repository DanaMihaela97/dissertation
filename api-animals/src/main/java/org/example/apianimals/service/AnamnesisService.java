package org.example.apianimals.service;

import org.example.apianimals.dto.AnamnesisCreateDto;
import org.example.apianimals.dto.AnamnesisInfoDto;

public interface AnamnesisService {
    AnamnesisInfoDto createAnamnesis(AnamnesisCreateDto anamnesisCreateDto);
}
