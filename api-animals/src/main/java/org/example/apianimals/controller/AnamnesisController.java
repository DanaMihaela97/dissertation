package org.example.apianimals.controller;

import org.example.apianimals.dto.AnamnesisCreateDto;
import org.example.apianimals.dto.AnamnesisInfoDto;
import org.example.apianimals.service.AnamnesisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/animals")
public class AnamnesisController {

    private final AnamnesisService anamnesisService;


    public AnamnesisController(AnamnesisService anamnesisService) {
        this.anamnesisService = anamnesisService;
    }

    @PostMapping("/anamnesis")
    public ResponseEntity<AnamnesisInfoDto> createAnamnesis(@RequestBody AnamnesisCreateDto dto) {
        AnamnesisInfoDto result = anamnesisService.createAnamnesis(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

}
