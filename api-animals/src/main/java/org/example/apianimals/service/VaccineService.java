package org.example.apianimals.service;


import org.example.apianimals.dto.VaccineDto;
import org.example.apianimals.entity.Vaccine;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VaccineService {
    List<VaccineDto> getVaccines();
}
