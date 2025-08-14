package org.example.apichat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private int rating;
    @Column(length=2000)
    private String feedback;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String name;
}
