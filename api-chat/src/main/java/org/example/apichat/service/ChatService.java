package org.example.apichat.service;

import org.example.apichat.entity.Consultation;

import java.util.List;

public interface ChatService {
    List<Consultation> getConsultationsByAnimalId(Long animalId);
}