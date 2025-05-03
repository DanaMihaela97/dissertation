package org.example.apianimals.repository;


import org.example.apianimals.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    Vaccine getVaccinesById(Long id);
}
