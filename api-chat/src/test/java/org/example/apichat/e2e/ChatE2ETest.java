//package org.example.apichat.e2e;
//
//import org.example.apichat.dto.Animal;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.web.client.TestRestTemplate;
//import org.springframework.boot.test.web.server.LocalServerPort;
//import org.springframework.http.*;
//
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//public class ChatE2ETest {
//
//    @LocalServerPort
//    private int port;
//
//    @Autowired
//    private TestRestTemplate restTemplate;
//
//    private HttpHeaders headers;
//    private String baseUrl;
//    private TestConfig testConfig;
//
//    @BeforeEach
//    void setup() {
//
//        testConfig = new TestConfig(restTemplate, port);
//
//        headers = testConfig.getHeaders("test@test.com", "test");
//        baseUrl = testConfig.getBaseUrl();
//    }
//
//    @Test
//    void shouldRunFullConsultation() {
//    // cream profilul animalului
//        Animal animal = new Animal();
//        animal.setId(1L);
//        animal.setAnimalName("Rexyyy");
//        animal.setType("Câine");
//        animal.setAge(5);
//
//    // incepem o sesiune de chat
//        HttpEntity<Animal> startRequest = new HttpEntity<>(animal, headers);
//        ResponseEntity<Map> startResponse = restTemplate.postForEntity(
//                baseUrl + "/api/chat/start",
//                startRequest,
//                Map.class
//        );
//
//        assertEquals(HttpStatus.OK, startResponse.getStatusCode());
//        Long sessionId = Long.valueOf((String) startResponse.getBody().get("sessionId"));
//        assertNotNull(sessionId);
//
//    // trimitem mesaj catre chat
//        HttpEntity<String> msgRequest = new HttpEntity<>("Are tuse si nu mananca.", headers);
//        ResponseEntity<Map> msgResponse = restTemplate.postForEntity(
//                baseUrl + "/api/chat/send/" + sessionId,
//                msgRequest,
//                Map.class
//        );
//        assertEquals(HttpStatus.OK, msgResponse.getStatusCode());
//
//        String reply = (String) msgResponse.getBody().get("reply");
//        Boolean finished = (Boolean) msgResponse.getBody().get("finished");
//        if (finished == null) finished = false;
//
//        System.out.println("BOT: " + reply);
//        System.out.println("Sesiunea terminată? " + finished);
//
//        int counter = 0;
//        while (!finished && counter < 5) {
//            counter++;
//            HttpEntity<String> followUp = new HttpEntity<>("De 3 zile are aceste simptome", headers);
//            ResponseEntity<Map> followUpResponse = restTemplate.postForEntity(
//                    baseUrl + "/api/chat/send/" + sessionId,
//                    followUp,
//                    Map.class
//            );
//
//            reply = (String) followUpResponse.getBody().get("reply");
//            finished = (Boolean) followUpResponse.getBody().get("finished");
//            if (finished == null) finished = false;
//            System.out.println("BOT: " + reply);
//            System.out.println("Sesiunea terminată? " + finished);
//        }
//
//        assertTrue(finished, "Sesiunea ar fi trebuit să fie terminată la finalul consultului");
//        assertNotNull(reply);
//        assertTrue(reply.toLowerCase().contains("diagnostic") || reply.toLowerCase().contains("tratament"),
//                "Răspunsul final ar trebui să conțină diagnostic sau tratament");
//    }
//}
