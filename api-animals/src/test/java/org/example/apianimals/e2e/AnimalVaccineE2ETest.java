package org.example.apianimals.e2e;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.apianimals.dto.AnimalCreateDto;
import org.example.apianimals.dto.AnimalInfoDto;
import org.example.apianimals.dto.AnimalVaccineCreateDto;
import org.example.apianimals.dto.AnimalVaccineInfoDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.jdbc.Sql;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
public class AnimalVaccineE2ETest {
    @Autowired
    private TestRestTemplate restTemplate;

    private JwtDecoder jwtDecoder;
    private HttpHeaders headers;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {

        jwtDecoder = Mockito.mock(JwtDecoder.class);
        Map<String, Object> claims = Collections.singletonMap("sub", "test-user-id");
        Jwt mockJwt = new Jwt("mock-token-value", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "none"), claims);
        when(jwtDecoder.decode(anyString())).thenReturn(mockJwt);

        headers = new HttpHeaders();
        headers.setBearerAuth("mock-token");
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
        assertThat(createdAnimal.getType()).isEqualTo("dog");

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
    @Sql("/data.sql")
    void shouldAddVaccinesToAnimal() {
        AnimalCreateDto animal = new AnimalCreateDto();
        animal.setAnimalName("Bella");
        animal.setBirthdate("2021-03-12");
        animal.setSex("Femelă");
        animal.setAge(2);
        animal.setWeight("8");
        animal.setType("Pisică");
        animal.setBreed("Siamese");

        HttpEntity<AnimalCreateDto> createRequest = new HttpEntity<>(animal, headers);
        AnimalInfoDto createdAnimal = restTemplate.exchange("/api/animals/", HttpMethod.POST, createRequest, AnimalInfoDto.class).getBody();
        assertThat(createdAnimal).isNotNull();

        LocalDate firstDose = LocalDate.of(2023, 1, 1);
        LocalDate secondDose = LocalDate.of(2023, 2, 1);
        AnimalVaccineCreateDto vaccineDto = new AnimalVaccineCreateDto();
        vaccineDto.setVaccineId(101L);
        vaccineDto.setFirstDoseDate(firstDose);
        vaccineDto.setSecondDoseDate(secondDose);

        HttpEntity<List<AnimalVaccineCreateDto>> vaccineRequest = new HttpEntity<>(Collections.singletonList(vaccineDto), headers);
        ResponseEntity<AnimalVaccineInfoDto[]> response = restTemplate.exchange(
                "/api/animals/" + createdAnimal.getId() + "/vaccines",
                HttpMethod.POST,
                vaccineRequest,
                AnimalVaccineInfoDto[].class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnimalVaccineInfoDto[] vaccines = response.getBody();
        assertThat(vaccines).isNotEmpty();
        assertThat(vaccines[0].getVaccineId()).isEqualTo(101);
        assertThat(vaccines[0].getFirstDoseDate()).isEqualTo(firstDose);
        assertThat(vaccines[0].getSecondDoseDate()).isEqualTo(secondDose);
    }

}


