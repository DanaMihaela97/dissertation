package org.example.apigateway.e2e;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.jdbc.Sql;
import java.util.Map;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql("/schema.sql")
class FullApplicationFlowTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldRunFullConsultationWithAnimal() {
        String email = "test@test.com";
        String password = "test";

        KeycloakAuthService keycloakAuthService = new KeycloakAuthService(
                restTemplate.getRestTemplate(),
                "http://localhost:8080/realms/vetcare/protocol/openid-connect/token",
                "api-gateway-client",
                "bxSlVZ5gHeVRjT4iFujFNTuUygFTJzG4"
        );

        HttpHeaders authHeaders = keycloakAuthService.getHeaders(email, password);

        String animalBody = """
    {
        "animalName":"Rexonna",
        "birthdate":"2020-05-05",
        "sex":"Mascul",
        "age":5,
        "weight": "15.2",
        "type":"Câine",
        "breed":"Labrador"
    }
    """;

        HttpEntity<String> createAnimalRequest = new HttpEntity<>(animalBody, authHeaders);
        ResponseEntity<Map> createAnimalResponse = restTemplate.exchange(
                "/api/animals/",
                HttpMethod.POST,
                createAnimalRequest,
                Map.class
        );

        assertThat(createAnimalResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Object idObj = createAnimalResponse.getBody().get("id");
        Long animalId = Long.valueOf(idObj.toString());
        assertThat(animalId).isNotNull();

        Map<String, Object> animal = Map.of(
                "id", animalId,
                "animalName", "Rex",
                "type", "Câine",
                "age", 5
        );

        HttpEntity<Map<String, Object>> startRequest = new HttpEntity<>(animal, authHeaders);
        ResponseEntity<Map> startResponse = restTemplate.postForEntity(
                "/api/chat/start",
                startRequest,
                Map.class
        );

        assertThat(startResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Object sessionIdObj = startResponse.getBody().get("sessionId");
        Long sessionId = Long.valueOf(sessionIdObj.toString());
        assertThat(sessionId).isNotNull();

        HttpEntity<String> msgRequest = new HttpEntity<>("Are tuse și nu mănâncă.", authHeaders);
        ResponseEntity<Map> msgResponse = restTemplate.postForEntity(
                "/api/chat/send/" + sessionId,
                msgRequest,
                Map.class
        );

        assertThat(msgResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        String reply = (String) msgResponse.getBody().get("reply");
        Boolean finished = (Boolean) msgResponse.getBody().get("finished");
        if (finished == null) finished = false;

        int counter = 0;
        while (!finished && counter < 5) {
            counter++;
            HttpEntity<String> followUp = new HttpEntity<>("De 3 zile are aceste simptome", authHeaders);
            ResponseEntity<Map> followUpResponse = restTemplate.postForEntity(
                    "/api/chat/send/" + sessionId,
                    followUp,
                    Map.class
            );

            reply = (String) followUpResponse.getBody().get("reply");
            finished = (Boolean) followUpResponse.getBody().get("finished");
            if (finished == null) finished = false;
        }

        assertThat(finished).isTrue();
        assertThat(reply).isNotNull();
        assertThat(reply.toLowerCase()).containsAnyOf("diagnostic", "tratament");
    }

}
