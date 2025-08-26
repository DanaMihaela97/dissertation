package org.example.apigateway.e2e;

import org.example.apigateway.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiGatewayE2ETest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldRegisterUserAndAccessProtectedEndpoint() {

        // Creăm user dinamic
        String uniqueEmail = "maritcadana" + System.currentTimeMillis() + "@gmail.com";
        String password = "dana"; // parola folosită la login

        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail(uniqueEmail);
        registerRequest.setPassword(password);
        registerRequest.setFirstName("Dana");
        registerRequest.setLastName("Maritca");

        ResponseEntity<String> registerResponse = restTemplate.postForEntity(
                "/signUp",
                registerRequest,
                String.class
        );
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Obținem token folosind exact user-ul creat
        String tokenUrl = "http://localhost:8080/realms/vetcare/protocol/openid-connect/token";
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
        tokenRequest.add("grant_type", "password");
        tokenRequest.add("client_id", "api-gateway-client");
        tokenRequest.add("client_secret", "bxSlVZ5gHeVRjT4iFujFNTuUygFTJzG4"); // dacă e confidential
        tokenRequest.add("username", uniqueEmail); // folosește user-ul creat
        tokenRequest.add("password", password);
        tokenRequest.add("scope", "openid");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(tokenRequest, tokenHeaders);
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, request, Map.class);

        assertThat(tokenResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        String accessToken = (String) tokenResponse.getBody().get("access_token");
        assertThat(accessToken).isNotNull();

        // Folosim token-ul pentru a accesa endpoint-ul protejat
        HttpHeaders authHeaders = new HttpHeaders();
        authHeaders.setBearerAuth(accessToken);

        HttpEntity<Void> requestEntity = new HttpEntity<>(authHeaders);
        ResponseEntity<String> animalsResponse = restTemplate.exchange(
                "/api/animals/",
                HttpMethod.GET,
                requestEntity,
                String.class
        );

        assertThat(animalsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(animalsResponse.getBody()).contains("animal");
    }


}
