package org.example.apichat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long animalId;
    private String userEmail;

    @Lob
    private String diagnosis;

    @Lob
    private String treatment;

    @Lob
    private String advice;

    private LocalDateTime createdAt;
}
