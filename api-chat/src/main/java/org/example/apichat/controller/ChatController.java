//package org.example.apichat.controller;
//
//import org.example.apichat.dto.Animal;
//import org.example.apichat.dto.Vaccine;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.util.UriComponentsBuilder;
//
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/chat")
//public class ChatController {
//    @Value("${gemini.api.key}")
//    private String apiKey;
//    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
//
//    @GetMapping("/test")
//    public ResponseEntity<String> test()
//    {
//        return ResponseEntity.ok("Hello chat");
//    }
//
//    @PostMapping("/analyze")
//    public ResponseEntity<Map<String, Object>> analyzeAnimal(@RequestBody Animal animal) {
//        System.out.println("Received animal data: " + animal);
//
//        String prompt = String.format(
//                "Ești un medic veterinar. Un proprietar îți cere ajutor pentru un animal cu următoarele date:\n\n" +
//                        "Nume: %s\n" +
//                        "Data nașterii: %s\n" +
//                        "Sex: %s\n" +
//                        "Vârsta: %d\n" +
//                        "Tip: %s\n" +
//                        "Greutate: %s\n" +
//                        "Rasa: %s\n" +
//                        "Anamneză: %s\n\n" +
//                        "Vaccinuri: %s\n" +
//                        "Te rog să oferi un răspuns clar și structurat cu următoarele secțiuni, fiecare având un alineat la început: \n\n" +
//                        "1️⃣ **Diagnostic:** Ce afecțiuni posibile ar putea avea acest animal?\n" +
//                        "2️⃣ **Tratament:** Ce tratamente sunt recomandate?\n" +
//                        "3️⃣ **Sfaturi:** Ce măsuri imediate trebuie luate acasă?\n\n" +
//                        "💡 Te rog să răspunzi detaliat în limba română.",
//                animal.getAnimalName(),
//                animal.getBirthdate(),
//                animal.getSex(),
//                animal.getAge(),
//                animal.getType(),
//                animal.getWeight(),
//                animal.getBreed(),
//                animal.getAnamnesis(),
//                formatVaccines(animal.getVaccines())
//        );
//
//
//        String requestBody = String.format("{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}", prompt);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
//        RestTemplate restTemplate = new RestTemplate();
//
//        try {
//            ResponseEntity<Map> response = restTemplate.exchange(
//                    GEMINI_URL + "?key=" + apiKey,
//                    HttpMethod.POST,
//                    entity,
//                    Map.class
//            );
//
//            Map<String, Object> responseBody = response.getBody();
//            System.out.println("Response from Gemini: " + responseBody);
//
//            String aiResponse = extractAiResponse(responseBody);
//            return ResponseEntity.ok(Map.of("reply", aiResponse));
//        } catch (Exception e) {
//            System.err.println("Error during API request: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("reply", "Eroare la procesarea cererii. Încearcă mai târziu."));
//        }
//    }
//    private String formatVaccines(List<Vaccine> vaccines) {
//        if (vaccines == null || vaccines.isEmpty()) {
//            return "Nicio informație despre vaccinuri.";
//        }
//
//        StringBuilder formattedVaccines = new StringBuilder();
//
////        for (Vaccine vaccine : vaccines) {
////            if (vaccine.getAnimalType() == AnimalType.Câine) {
////                formattedVaccines.append(String.format(
////                        "Vaccin: %s, Vârstă (săptămâni): %d, Rapel: %s, Ultima administrare: %s\n",
////                        vaccine.getName(),
////                        vaccine.getAgeWeeks(),
////                        vaccine.getRapel()
////                ));
////            } else if (vaccine.getAnimalType() == AnimalType.Pisică) {
////                formattedVaccines.append(String.format(
////                        "Vaccin: %s, Vârstă (săptămâni): %d, Rapel: %s, Ultima administrare: %s\n",
////                        vaccine.getName(),
////                        vaccine.getAgeWeeks(),
////                        vaccine.getRapel()
////                ));
////            }
////        }
//
//        return formattedVaccines.toString();
//    }
//
//
//    private String extractAiResponse(Map<String, Object> responseBody) {
//        if (responseBody == null || !responseBody.containsKey("candidates")) {
//            return "Nu am putut obține un răspuns de la AI.";
//        }
//
//        Object candidates = responseBody.get("candidates");
//        if (candidates instanceof List) {
//            List<Map<String, Object>> candidatesList = (List<Map<String, Object>>) candidates;
//            if (!candidatesList.isEmpty()) {
//                Map<String, Object> firstCandidate = candidatesList.get(0);
//                Object contentObj = firstCandidate.get("content");
//
//                if (contentObj instanceof Map) {
//                    Map<String, Object> content = (Map<String, Object>) contentObj;
//                    Object partsObj = content.get("parts");
//
//                    if (partsObj instanceof List) {
//                        List<Map<String, Object>> parts = (List<Map<String, Object>>) partsObj;
//                        if (!parts.isEmpty()) {
//                            Object textObj = parts.get(0).get("text");
//                            if (textObj instanceof String) {
//                                return (String) textObj;
//                            }
//                        }
//                    }
//                }
//            }
//        }
//        return "Nu am putut obține un răspuns valid.";
//    }
//
//    @PostMapping("/locateVeterinaryOffices")
//    public ResponseEntity<List<Map<String, Object>>> locateVeterinaryOffices(@RequestBody Map<String, String> location) {
////        double lat = location.get("lat");
////        double lon = location.get("lon");
//        String address=location.get("address");
//        System.out.println("Adresa primita: " + address);
//
//        double[] coordinates = geocodeAddress(address);
//        if (coordinates == null) {
//            return ResponseEntity.badRequest().body(Collections.emptyList());
//        }
//
//        List<Map<String, Object>> closestOffices = findClosestVeterinaryOffices(coordinates[0], coordinates[1]);
//        return ResponseEntity.ok(closestOffices);
//    }
//    private double[] geocodeAddress(String address) {
//        String googleGeocodeApiKey = "AIzaSyBi_pbMjgl7WW04y_U3Pvyg4wV8V3d-Xkw";
//        String url = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/geocode/json")
//                .queryParam("address", address)
//                .queryParam("key", googleGeocodeApiKey)
//                .toUriString();
//
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<GoogleGeocodeResponse> response = restTemplate.exchange(
//                url, HttpMethod.GET, null, GoogleGeocodeResponse.class);
//
//        GoogleGeocodeResponse rsp = response.getBody();
//
//        if (rsp == null || rsp.getResults() == null || rsp.getResults().isEmpty()) {
//            System.out.println("Adresă invalidă!");
//            return null;
//        }
//
//        GoogleGeocodeResponse.Geometry.Location location = rsp.getResults().get(0).getGeometry().getLocation();
//        return new double[]{location.getLat(), location.getLng()};
//    }
//
//
//    private List<Map<String, Object>> findClosestVeterinaryOffices(double latitude, double longitude) {
//        String googlePlacesApiKey = "AIzaSyBi_pbMjgl7WW04y_U3Pvyg4wV8V3d-Xkw";
//        String region = "ro";
//        String radius = "1000";
//        String type = "veterinary_care";
//
//        String url = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/place/nearbysearch/json")
//                .queryParam("location", latitude + "," + longitude)
//                .queryParam("radius", radius)
//                .queryParam("type", type)
//                .queryParam("region", region)
//                .queryParam("key", googlePlacesApiKey)
//                .toUriString();
//
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<GooglePlacesResponse> response = restTemplate.exchange(
//                url, HttpMethod.GET, null, GooglePlacesResponse.class);
//
//        GooglePlacesResponse rsp = response.getBody();
//
//        if (rsp == null || rsp.getResults() == null) {
//            System.out.println("No results found!");
//            return Collections.emptyList();
//        }
//
//        List<Map<String, Object>> offices = new ArrayList<>();
//        for (Place place : rsp.getResults()) {
//            double placeLat = place.getGeometry().getLocation().getLat();
//            double placeLon = place.getGeometry().getLocation().getLng();
//
//            double distance = calculateDistance(latitude, longitude, placeLat, placeLon);
//            Map<String, Object> officeData = new HashMap<>();
//            officeData.put("name", place.getName());
//            officeData.put("address", place.getVicinity());
//            officeData.put("distance", String.format("%.2f km", distance));
//
//            offices.add(officeData);
//        }
//
//        return offices;
//    }
//
//
//    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
//        final int R = 6371; // Raza Pământului în km
//        double latDistance = Math.toRadians(lat2 - lat1);
//        double lonDistance = Math.toRadians(lon2 - lon1);
//
//        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
//                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
//                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
//
//        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//
//        return R * c; // Distanța în km
//    }
//
//    private String formatResponse(String response) {
//        String diagnostic = "<b>1. Diagnostic:</b><br><br>";
//        String tratament = "<b>2. Tratament:</b><br><br>";
//        String sfaturi = "<b> 3. Sfaturi:</b><br><br>";
//
//        String[] sections = response.split("(?=Diagnostic:|Tratament:|Sfaturi:)");
//
//        for (String section : sections) {
//            if (section.startsWith("Diagnostic:")) {
//                diagnostic += section.replace("Diagnostic:", "").trim() + "<br><br>";
//            } else if (section.startsWith("Tratament:")) {
//                tratament += section.replace("Tratament:", "").trim() + "<br><br>";
//            } else if (section.startsWith("Sfaturi:")) {
//                sfaturi += section.replace("Sfaturi:", "").trim() + "<br><br>";
//            }
//        }
//
//        return diagnostic + tratament + sfaturi;
//    }
//
//
//}
