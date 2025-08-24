package org.example.apianimals.e2e;

import org.example.apianimals.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AnimalControllerE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    private HttpHeaders headers;

    @BeforeEach
    void setup() {
        headers = new HttpHeaders();
        headers.setBearerAuth("token");
        headers.setContentType(MediaType.APPLICATION_JSON);
    }

    @Test
    void shouldCreateAndFetchAnimal() {
        AnimalCreateDto animal = new AnimalCreateDto();
        animal.setAnimalName("Rex");
        animal.setBirthdate("2020-05-01");
        animal.setSex("male");
        animal.setAge(3);
        animal.setWeight("20kg");
        animal.setType("dog");
        animal.setBreed("Labrador");

        HttpEntity<AnimalCreateDto> requestEntity = new HttpEntity<>(animal, headers);

        ResponseEntity<AnimalInfoDto> createResponse =
                restTemplate.exchange("/api/animals/", HttpMethod.POST, requestEntity, AnimalInfoDto.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnimalInfoDto createdAnimal = createResponse.getBody();
        assertThat(createdAnimal).isNotNull();
        assertThat(createdAnimal.getAnimalName()).isEqualTo("Rex");

        HttpEntity<Void> getRequest = new HttpEntity<>(headers);
        ResponseEntity<AnimalInfoDto[]> listResponse =
                restTemplate.exchange("/api/animals/", HttpMethod.GET, getRequest, AnimalInfoDto[].class);

        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        boolean found = false;
        for (AnimalInfoDto a : listResponse.getBody()) {
            if (a.getId().equals(createdAnimal.getId())) {
                found = true;
                break;
            }
        }
        assertThat(found).isTrue();
    }

    @Test
    void shouldAddVaccinesToAnimal() {
        AnimalCreateDto animal = new AnimalCreateDto();
        animal.setAnimalName("Bella");
        animal.setBirthdate("2021-03-12");
        animal.setSex("female");
        animal.setAge(2);
        animal.setWeight("8kg");
        animal.setType("cat");
        animal.setBreed("Siamese");

        HttpEntity<AnimalCreateDto> createRequest = new HttpEntity<>(animal, headers);
        AnimalInfoDto createdAnimal = restTemplate.exchange("/api/animals/", HttpMethod.POST, createRequest, AnimalInfoDto.class).getBody();
        assertThat(createdAnimal).isNotNull();

        List<AnimalVaccineCreateDto> vaccines = new ArrayList<>();
        AnimalVaccineCreateDto vaccineDto = new AnimalVaccineCreateDto();
        vaccineDto.setVaccineId(1L);
        vaccineDto.setDateAdministered(LocalDate.now());
        vaccines.add(vaccineDto);

        HttpEntity<List<AnimalVaccineCreateDto>> vaccineRequest = new HttpEntity<>(vaccines, headers);
        ResponseEntity<AnimalVaccineInfoDto[]> response = restTemplate.exchange(
                "/api/animals/" + createdAnimal.getId() + "/vaccines",
                HttpMethod.POST,
                vaccineRequest,
                AnimalVaccineInfoDto[].class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotEmpty();
        assertThat(response.getBody()[0].getVaccineId()).isEqualTo(1);
    }
}