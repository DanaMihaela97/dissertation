package org.example.controller;

import org.example.dto.AnamnesisCreateDto;
import org.example.dto.AnamnesisResponseDto;
import org.example.service.AnamnesisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/anamnesis")
public class AnamensisController {

    private final AnamnesisService anamnesisService;

    public AnamensisController(AnamnesisService anamnesisService) {
        this.anamnesisService = anamnesisService;
    }

    @PostMapping
    public ResponseEntity<AnamnesisResponseDto> createAnamnesis(@RequestBody AnamnesisCreateDto request) {
        return ResponseEntity.ok(anamnesisService.createAnamnesis(request));
    }


}
