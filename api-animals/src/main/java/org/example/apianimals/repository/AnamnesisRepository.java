package org.example.apianimals.repository;

import org.example.apianimals.entity.Anamnesis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnamnesisRepository extends JpaRepository<Anamnesis, Long> {
}
