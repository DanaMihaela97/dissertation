package org.example.apichat.repository;

import org.example.apichat.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findAllByAnimalId(Long animalId);
}
