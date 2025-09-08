// TestConfig.java
package org.example.apichat.e2e;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.time.Instant;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;

@TestConfiguration
public class TestConfig {

    @Bean
    public JwtDecoder jwtDecoder() {
        JwtDecoder mockDecoder = Mockito.mock(JwtDecoder.class);
        Jwt mockJwt = new Jwt(
                "mock-token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "none"),
                Map.of("sub", "test-user-id")
        );
        Mockito.when(mockDecoder.decode(anyString())).thenReturn(mockJwt);
        return mockDecoder;
    }
}
