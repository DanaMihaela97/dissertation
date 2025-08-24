package org.example.apianimals.e2e;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.apianimals.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class AnimalControllerE2ETest {

   @Autowired
   private MockMvc mockMvc;

   @Autowired
   private TestRestTemplate restTemplate;

   @MockBean
   private JwtDecoder jwtDecoder;
   private HttpHeaders headers;

   @BeforeEach
   void setup() {
      Map<String, Object> claims = Collections.singletonMap("sub", "test-user-id");
      Jwt mockJwt = new Jwt("mock-token-value", Instant.now(), Instant.now().plusSeconds(60), Map.of("alg", "none"), claims);

      when(jwtDecoder.decode(anyString())).thenReturn(mockJwt);

      headers = new HttpHeaders();
      headers.setBearerAuth("any-valid-looking-token");
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

      List<AnimalVaccineCreateDto> vaccines = new ArrayList<>();
      AnimalVaccineCreateDto vaccineDto = new AnimalVaccineCreateDto();
      vaccineDto.setVaccineId(101L);
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
      assertThat(response.getBody()[0].getVaccineId()).isEqualTo(101);
   }

   @Test
   void shouldFetchAndPrintAllVaccines() throws Exception { // Add "throws Exception" for the object mapper
      // GIVEN: A prepared HTTP request with authentication headers
      HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
      ObjectMapper objectMapper = new ObjectMapper();

      // WHEN: We make a GET request to the vaccines endpoint
      ResponseEntity<String> response = restTemplate.exchange(
            "/api/vaccines/",
            HttpMethod.GET,
            requestEntity,
            String.class // <-- Change this to String.class
      );

      assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
      System.out.println("Actual JSON Response:");
      System.out.println(response.getBody());

   }
}