package org.example.apigateway.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.apigateway.dto.RegisterRequest;
import org.example.apigateway.entity.User;
import org.example.apigateway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl{
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final PasswordEncoder passwordEncoder;

    @Value("${realms_admin}")
    private String realmsAdmin;

    @Value("${realms_master}")
    private String realmsMaster;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public ResponseEntity<String> registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("email deja folosit");
        }

        try {
            String token = getAdminToken();

            Map<String, Object> payload = new HashMap<>();
            payload.put("username", request.getEmail());
            payload.put("email", request.getEmail());
            payload.put("enabled", true);
            payload.put("firstName", request.getFirstName());
            payload.put("lastName", request.getLastName());

            Map<String, Object> credentials = new HashMap<>();
            credentials.put("type", "password");
            credentials.put("value", request.getPassword());
            credentials.put("temporary", false);
            payload.put("credentials", List.of(credentials));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(token);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    realmsAdmin + "/users",
                    entity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.CONFLICT) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("email deja folosit");
            }

            if (response.getStatusCode() == HttpStatus.CREATED) {
                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);

                return ResponseEntity.ok("user ul a fost creat");
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("eroare: " + response.getBody());
            }

        } catch (Exception e) {
            if (e.getMessage().contains("User exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("email deja folosit");
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    private String getAdminToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("grant_type", "password");
        data.add("client_id", "admin-cli");
        data.add("username", "admin");
        data.add("password", "admin");

        HttpEntity<?> request = new HttpEntity<>(data, headers);

        ResponseEntity <String> response = restTemplate.postForEntity(
                realmsMaster,
                request,
                String.class

        );

        if (response.getStatusCode().is2xxSuccessful()) {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = null;
            try {
                root = objectMapper.readTree(String.valueOf(response.getBody()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            String token = root.path("access_token").asText();
            System.out.println(token);
            return token;
        }

        throw new RuntimeException("eroare obtinere token");
    }
}