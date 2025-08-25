package org.example.apianimals.service.impl;

import org.example.apianimals.config.SnsPublisher;
import org.example.apianimals.dto.AnimalVaccineJoinDto;
import org.example.apianimals.repository.AnimalRepository;
import org.example.apianimals.repository.AnimalVaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmailService {
    private final AnimalVaccineRepository repository;
    private final SnsPublisher snsPublisher;
    private final AnimalRepository animalRepository;


    @Autowired
    public EmailService(AnimalVaccineRepository repository, SnsPublisher snsPublisher, AnimalRepository animalRepository) {
        this.repository = repository;
        this.snsPublisher = snsPublisher;
        this.animalRepository = animalRepository;
    }


    public void sendDailyRapelEmails() {
        Set<String> emails = animalRepository.findAll().stream().map(a -> a.getOwnerEmail()).collect(Collectors.toSet());
        for (String email : emails) {
            List<AnimalVaccineJoinDto> animals = repository.findAnimalsByEmail(email);
            for (AnimalVaccineJoinDto animal : animals) {
                String subject = "Rapel vaccin - " + animal.getAnimalName();
                String bodyText = "Bună,\n\n" + "Vă informăm că animalul dumneavoastră " +
                        animal.getAnimalName() + " ar trebui să primească a doua doză (rapelul) a vaccinului \n" +
                        animal.getVaccineName() + " în jurul datei de **" +
                        animal.getFirstDoseDate().plusDays(animal.getRapelDays()) + "**.\n\n" +
                        "Respectarea acestui interval este importantă pentru eficiența și protecția vaccinului.\n\n" +
                        "Pentru mai multe detalii, accesați link-ul de mai jos:\n" + "PawCare: http://localhost:3000/home\n\n" +
                        "Echipa PawCare 🐾";
                snsPublisher.sendEmail(subject, bodyText, email);
            }

        }
    }
}