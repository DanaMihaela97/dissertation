package org.example.apichat.e2e;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.time.Instant;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Import(TestConfig.class)
public class ReviewE2ETest {
    @MockBean
    private JwtDecoder jwtDecoder;

    @Autowired
    private TestRestTemplate restTemplate;

    private HttpHeaders headers;
    @BeforeEach
    void setUp() {
        Jwt mockJwt = new Jwt(
                "mock-token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "none"),
                Map.of("sub", "test-user-id")
        );
        Mockito.when(jwtDecoder.decode(anyString())).thenReturn(mockJwt);
    }

    @Test
    void shouldAddReviewSuccessfully() {
        Map<String, Object> reviewBody = Map.of(
                "rating", 5,
                "feedback", "Servicii excelente!",
                "createdAt", Instant.now().toString()
        );

        ResponseEntity<Void> postResponse = restTemplate.postForEntity(
                "/api/reviews",
                new HttpEntity<>(reviewBody, headers),
                Void.class
        );

        assertEquals(HttpStatus.OK, postResponse.getStatusCode());
    }
}

