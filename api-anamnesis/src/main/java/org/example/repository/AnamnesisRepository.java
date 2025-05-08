package org.example.repository;

import org.example.entity.Anamnesis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnamnesisRepository extends JpaRepository<Anamnesis,Long> {
}
