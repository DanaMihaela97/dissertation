package org.example.apianimals.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "animal_id", nullable = false)
    @JsonBackReference //nu trb serializata
    private Animal animal;

    @Override
    public String toString() {
        return "Anamnesis{" +
                "id=" + id +
                ", anamnesis='" + anamnesis + '\'' +
                ", address='" + address + '\'' +
                ", animal=" + animal +
                '}';
    }
}

