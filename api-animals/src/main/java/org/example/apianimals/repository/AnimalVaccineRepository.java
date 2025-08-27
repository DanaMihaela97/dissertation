package org.example.apianimals.repository;

import org.example.apianimals.dto.AnimalVaccineJoinDto;
import org.example.apianimals.entity.AnimalVaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AnimalVaccineRepository extends JpaRepository<AnimalVaccine, Long> {
    List<AnimalVaccine> findByAnimalId(Long animalId);

    Optional<AnimalVaccine> findByAnimalIdAndVaccineId(Long animalId, Long vaccineId);

    void deleteByAnimalIdAndVaccineId(Long animalId, Long vaccineId);

    @Query("SELECT new org.example.apianimals.dto.AnimalVaccineJoinDto(" +
            "A.id, A.animalName, V.id, AV.firstDoseDate, AV.secondDoseDate, V.name, V.rapelDays) " +
            "FROM Animal A " +
            "JOIN A.animalVaccines AV " +
            "JOIN AV.vaccine V " +
            "WHERE A.ownerEmail = :email " +
            "AND V.rapelDays != -1 " +
            "AND AV.firstDoseDate < :cutoffDate")
    List<AnimalVaccineJoinDto> findAnimalsByEmail(@Param("email") String email,
                                                  @Param("cutoffDate") LocalDate cutoffDate);
}