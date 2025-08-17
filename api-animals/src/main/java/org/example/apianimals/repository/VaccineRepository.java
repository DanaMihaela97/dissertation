package org.example.apianimals.repository;


import org.example.apianimals.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    Vaccine getVaccinesById(Long id);
}
