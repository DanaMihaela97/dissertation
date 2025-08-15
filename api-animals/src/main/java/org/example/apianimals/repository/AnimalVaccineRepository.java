package org.example.apianimals.repository;

import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineJoinDto;
import org.example.apianimals.entity.Animal;
import org.example.apianimals.entity.AnimalVaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AnimalVaccineRepository  extends JpaRepository<AnimalVaccine, Long> {
    List<AnimalVaccine> findByAnimalId(Long animalId);

//    @NativeQuery(value="SELECT A.id A.animal_name V.vaccine_id V.date_administered " +
//            "from Animal A INNER JOIN animal_vaccines V ON A.id = V.animal_id" +
//            " WHERE A.email LIKE %?1")
@NativeQuery(
        "SELECT A.id, A.animal_name, AV.vaccine_id, AV.date_administered, V.name " +
                "FROM (" +
                "    SELECT id, animal_name " +
                "    FROM Animal " +
                "    WHERE email LIKE CONCAT(?1, '%') " +   // indexed search
                ") A " +
                "INNER JOIN animal_vaccines AV ON A.id = AV.animal_id " +
                "INNER JOIN vaccines V ON AV.vaccine_id = V.id " +
                "WHERE V.rapel_days != -1 " +
                "AND AV.date_administered < DATE_SUB(CURDATE(), INTERVAL 14 DAY)"
)
List<AnimalVaccineJoinDto> findAnimals(String email);

    Optional<AnimalVaccine> findByAnimalIdAndVaccineId(Long animalId, Long vaccineId);
    void deleteByAnimalIdAndVaccineId(Long animalId, Long vaccineId);

}
