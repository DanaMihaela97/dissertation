package org.example.service.impl;

import org.example.dto.AnimalDto;
import org.example.dto.VaccineDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class AnimalClientService {
    private final RestTemplate restTemplate;

    @Value("${animal.service.url}")
    private String animalServiceUrl;

    public AnimalClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AnimalDto getAnimalById(Long id) {
        return restTemplate.getForObject(animalServiceUrl + "/animals/" + id, AnimalDto.class);
    }
    public List<VaccineDto> getVaccinesForAnimal(Long animalId) {
        String url = animalServiceUrl + "/" + animalId + "/vaccines";

        ResponseEntity<List<VaccineDto>> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<VaccineDto>>() {}
                );

        return response.getBody();
    }

}