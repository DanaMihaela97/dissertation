package org.example.apianimals.controller;

import org.example.apianimals.dto.VaccineDto;
import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vaccines")
public class VaccinesController {
    private final VaccineService vaccineService;
    @Autowired
    public VaccinesController(VaccineService vaccineService) {

        this.vaccineService = vaccineService;
    }
    @GetMapping("/")
    public ResponseEntity<List<VaccineDto>> getAllVaccines() {
        List<VaccineDto> vaccines = vaccineService.getVaccines();
        return ResponseEntity.ok(vaccines);
    }
}
