package org.example.apichat.e2e;

import io.restassured.RestAssured;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class TestConfig {
    private final TestRestTemplate restTemplate;
    private final int port;

    public TestConfig(TestRestTemplate restTemplate, int port) {
        this.restTemplate = restTemplate;
        this.port = port;
    }

    public HttpHeaders getHeaders(String username, String password) {
        String token = getAuthToken(username, password);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        return headers;
    }

    public String getBaseUrl() {
        return "http://localhost:" + port;
    }

    private String getAuthToken(String username, String password) {
        String keycloakTokenUrl = "http://localhost:8080/realms/vetcare/protocol/openid-connect/token";
        String clientId = "api-gateway-client";
        String clientSecret = "bxSlVZ5gHeVRjT4iFujFNTuUygFTJzG4";

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
    }
}

