package org.example.apianimals.service.impl;

import org.example.apianimals.convertor.VaccineMapper;
import org.example.apianimals.dto.VaccineDto;
import org.example.apianimals.repository.VaccineRepository;
import org.example.apianimals.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VaccineServiceImpl implements VaccineService {

    private final VaccineRepository vaccineRepository;

    @Autowired
    public VaccineServiceImpl(VaccineRepository vaccineRepository) {
        this.vaccineRepository = vaccineRepository;
    }

    @Override
    public List<VaccineDto> getVaccines() {
        return vaccineRepository.findAll().stream().map(VaccineMapper::toDto).toList();
    }

}
