package org.example.apianimals.repository;

import org.example.apianimals.dto.AnimalVaccineJoinDto;
import org.example.apianimals.entity.AnimalVaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;

import java.util.List;
import java.util.Optional;

public interface AnimalVaccineRepository extends JpaRepository<AnimalVaccine, Long> {
    List<AnimalVaccine> findByAnimalId(Long animalId);
    Optional<AnimalVaccine> findByAnimalIdAndVaccineId(Long animalId, Long vaccineId);
    void deleteByAnimalIdAndVaccineId(Long animalId, Long vaccineId);

    @NativeQuery(
            "SELECT A.id, A.animal_name, AV.vaccine_id, AV.date_administered, V.name, V.rapel_days " +
                    "FROM Animal A " +
                    "INNER JOIN animal_vaccines AV ON A.id = AV.animal_id " +
                    "INNER JOIN vaccines V ON AV.vaccine_id = V.id " +
                    "WHERE A.email LIKE CONCAT('%', ?1) " +
                    "AND V.rapel_days != -1 " +
                    "AND DATEDIFF(DATE_ADD(AV.date_administered, INTERVAL 14 DAY), CURDATE()) < 0"
    )
    List<AnimalVaccineJoinDto> findAnimalsByEmail(String email);
}
