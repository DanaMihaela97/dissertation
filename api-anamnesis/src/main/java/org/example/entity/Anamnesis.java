package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="anamnesis")
public class Anamnesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String anamnesis;
    private String address;
    private Long animalId;

    @Override
    public String toString() {
        return "Anamnesis{" +
                "id=" + id +
                ", anamnesis='" + anamnesis + '\'' +
                ", address='" + address + '\'' +
                ", animalId=" + animalId +
                '}';
    }
}
