package org.example.apianimals.repository;

import org.example.apianimals.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findAnimalsByOwnerEmail(String ownerEmail);

//    List<String> findDistinctEmailBy();
//    List<Animal> findDistinctByEmail(String email);
}