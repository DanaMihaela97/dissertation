package org.example.apianimals.repository;

import org.example.apianimals.entity.AnimalVaccine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnimalVaccineRepository  extends JpaRepository<AnimalVaccine, Long> {
    List<AnimalVaccine> findByAnimalId(Long animalId);
}
