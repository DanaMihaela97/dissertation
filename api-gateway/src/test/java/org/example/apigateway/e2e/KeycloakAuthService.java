package org.example.apigateway.e2e;

import io.restassured.RestAssured;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

public class KeycloakAuthService {

    private final RestTemplate restTemplate;
    private final String tokenUrl;
    private final String clientId;
    private final String clientSecret;

    public KeycloakAuthService(RestTemplate restTemplate,
                               String tokenUrl,
                               String clientId,
                               String clientSecret) {
        this.restTemplate = restTemplate;
        this.tokenUrl = tokenUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
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

    public HttpHeaders getHeaders(String username, String password) {
        String token = getAuthToken(username, password);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        return headers;
    }

}