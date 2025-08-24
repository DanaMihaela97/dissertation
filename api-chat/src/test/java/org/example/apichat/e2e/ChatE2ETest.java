package org.example.apichat.e2e;

import org.example.apichat.dto.Animal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ChatE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    private HttpHeaders headers;

    @BeforeEach
    void setup() {
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth("token");
    }

    @Test
    void shouldStartChatSession() {
        Animal animal = new Animal();
        animal.setId(1L);
        animal.setAnimalName("Rex");
        animal.setType("Câine");

        HttpEntity<Animal> request = new HttpEntity<>(animal, headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity("/api/chat/start", request, (Class<Map<String, Object>>) (Class<?>) Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.containsKey("sessionId")).isTrue();
    }
}