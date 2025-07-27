package org.example.apianimals.service.impl;

import org.example.apianimals.entity.Vaccine;
import org.example.apianimals.repository.VaccineRepository;
import org.example.apianimals.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
public class VaccineServiceImpl implements VaccineService {

    private final VaccineRepository vaccineRepository;

    @Autowired
    public VaccineServiceImpl(VaccineRepository vaccineRepository) {
        this.vaccineRepository = vaccineRepository;
    }

    @Override
    public List<Vaccine> getVaccines() {
        return vaccineRepository.findAll();
    }

    @Override
    public Flux<Vaccine> getUpdates() {
        return null;
    }
}
