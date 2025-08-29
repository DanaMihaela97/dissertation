package org.example.apigateway.e2e;

import org.example.apigateway.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql({"/schema.sql"})
class PublicEndpointsTest {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @Test
    void shouldRegisterUserSuccessfully() {
        String uniqueEmail = "testuser" + System.currentTimeMillis() + "@gmail.com";

        RegisterRequest request = new RegisterRequest();
        request.setEmail(uniqueEmail);
        request.setPassword("password123");
        request.setFirstName("Test");
        request.setLastName("User");

        ResponseEntity<String> response = restTemplate.postForEntity("/signUp", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("user ul a fost creat");
    }

    @Test
    void shouldReturnConflictWhenEmailExists() {
        String email = "maritcadana@gmail.com";

        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword("password123");
        request.setFirstName("Test");
        request.setLastName("User");

        ResponseEntity<String> response = restTemplate.postForEntity("/signUp", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).contains("email deja folosit");
    }

    @Test
    void shouldNotAccessProtectedEndpointWithoutAuth() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/animals/", String.class);

        assertThat(response.getStatusCode())
                .isIn(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

}
