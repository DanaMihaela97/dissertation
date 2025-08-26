package org.example.apichat.e2e;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.time.Instant;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ReviewE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl;
    private HttpHeaders headers;

    @BeforeEach
    void setUp() {
        this.baseUrl = "http://localhost:" + port;

        String jwtToken = getAuthToken("maritcadana@gmail.com", "dana");

        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwtToken);
    }

    @Test
    void shouldAddReviewSuccessfully() {
        String feedbackText = "Servicii excelente! Recomand cu caldura.";

        Map<String, Object> reviewBody = Map.of(
                "rating", 5,
                "feedback", feedbackText,
                "createdAt", Instant.now().toString()
        );

        HttpEntity<Map<String, Object>> postRequest = new HttpEntity<>(reviewBody, headers);

        ResponseEntity<Void> postResponse = restTemplate.postForEntity(
                "/api/reviews",
                postRequest,
                Void.class
        );

        assertEquals(HttpStatus.OK, postResponse.getStatusCode());

        HttpEntity<Void> getRequest = new HttpEntity<>(headers);

        ResponseEntity<String> getResponse = restTemplate.exchange(
                "/api/reviews/",
                HttpMethod.GET,
                getRequest,
                String.class
        );

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());

        String reviewsJson = getResponse.getBody();
        assertNotNull(reviewsJson);
        assertTrue(reviewsJson.contains(feedbackText), "Recenzia adaugata nu a fost gasita in lista!");

        System.out.println("VERIFICARE COMPLETĂ: Recenzia a fost adăugată și regăsită cu succes!");
    }

    private String getAuthToken(String username, String password) {
        String keycloakTokenUrl = "http://localhost:8080/realms/vetcare/protocol/openid-connect/token";
        String clientId = "api-gateway-client";
        String clientSecret = "bxSlVZ5gHeVRjT4iFujFNTuUygFTJzG4";

        try {
            return RestAssured.given()
                    .contentType("application/x-www-form-urlencoded")
                    .formParam("grant_type", "password")
                    .formParam("client_id", clientId)
                    .formParam("client_secret", clientSecret)
                    .formParam("username", username)
                    .formParam("password", password)
                    .when()
                    .post(keycloakTokenUrl)
                    .then()
                    .assertThat().statusCode(200)
                    .extract()
                    .path("access_token");
        } catch (Exception e) {
            throw new RuntimeException("Nu s-a putut obtine token-ul de la Keycloak. Verifica credentialele si daca Keycloak ruleaza.", e);
        }
    }
}
