package org.example.apichat.controller;

import org.example.apichat.dto.places.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@RestController
@RequestMapping("/api/locate")
public class ChatController {

    @PostMapping("/locateVeterinaryOffices")
    public ResponseEntity<List<Map<String, Object>>> locateVeterinaryOffices(@RequestBody Map<String, String> location) {
        double[] coordinates = geocodeAddress(location);
        if (coordinates == null) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
        //[47.1648795, 27.5882272]
        //[45.943161, 24.96676]
        //

        List<Map<String, Object>> closestOffices = findClosestVeterinaryOffices(coordinates[0], coordinates[1]);
        return ResponseEntity.ok(closestOffices);
    }

    private double[] geocodeAddress(Map<String, String> place) {
        String address = place.get("address");
        String city = place.get("city");
        String googleGeocodeApiKey = "AIzaSyBi_pbMjgl7WW04y_U3Pvyg4wV8V3d-Xkw";
        String fullAddress = String.format("%s+%s",
                address.trim().replaceAll("\\s+", "+"),
                city);

        String url = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/geocode/json")
                .queryParam("address", fullAddress)
                .queryParam("components", "country:RO")
                .queryParam("key", googleGeocodeApiKey)
                .encode()
                .toUriString();


        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<GoogleGeocodeResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, null, GoogleGeocodeResponse.class);

        GoogleGeocodeResponse rsp = response.getBody();
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        headers.set("Accept-Language", "ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> rawResponse = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
        );
        System.out.println(rawResponse.getBody());
        if (rsp == null || rsp.getResults() == null || rsp.getResults().isEmpty()) {
            System.out.println("Adresă invalidă!");
            return null;
        }

        GoogleGeocodeResponse.Geometry.Location location = rsp.getResults().get(0).getGeometry().getLocation();
        return new double[]{ location.getLat(), location.getLng() };
    }

    private List<Map<String, Object>> findClosestVeterinaryOffices(double latitude, double longitude) {
        String googlePlacesApiKey = "AIzaSyBi_pbMjgl7WW04y_U3Pvyg4wV8V3d-Xkw";
        String region = "ro";
        String radius = "1000";
        String type = "veterinary_care";

        String url = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/place/nearbysearch/json")
                .queryParam("location", latitude + "," + longitude)
                .queryParam("radius", radius)
                .queryParam("type", type)
                .queryParam("region", region)
                .queryParam("key", googlePlacesApiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<GooglePlacesResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, null, GooglePlacesResponse.class);

        GooglePlacesResponse rsp = response.getBody();

        if (rsp == null || rsp.getResults() == null) {
            System.out.println("No results found!");
            return Collections.emptyList();
        }

        List<Map<String, Object>> offices = new ArrayList<>();
        for (Place place : rsp.getResults()) {
            double placeLat = place.getGeometry().getLocation().getLat();
            double placeLon = place.getGeometry().getLocation().getLng();

            double distance = calculateDistance(latitude, longitude, placeLat, placeLon);

            Map<String, Object> placeDetails = fetchDetails(place.getPlaceId());
            String phoneNumber = (String) placeDetails.get("phone");

            Map<String, Object> officeData = new HashMap<>();
            officeData.put("name", place.getName());
            officeData.put("address", placeDetails.get("formatted_address"));
            officeData.put("coordinates", String.format("%s,%s", placeLat, placeLon));
            officeData.put("distance", String.format("%.2f km", distance));
            officeData.put("phone", phoneNumber);

            Object hoursObj = placeDetails.get("hours");
            List<String> scheduleList = Collections.emptyList();

            if (hoursObj instanceof PlaceDetailsResponse.Result.OpeningHours) {
                PlaceDetailsResponse.Result.OpeningHours openingHours = (PlaceDetailsResponse.Result.OpeningHours) hoursObj;
                if (openingHours.getWeekdayText() != null && !openingHours.getWeekdayText().isEmpty()) {
                    scheduleList = openingHours.getWeekdayText();
                }
            }
            String formattedSchedule = ScheduleFormatter.formatSchedule(scheduleList);

            officeData.put("hours", Collections.singletonList(formattedSchedule));

            offices.add(officeData);
        }

        return offices;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private Map<String, Object> fetchDetails(String placeId) {
        String googlePlacesApiKey = "AIzaSyBi_pbMjgl7WW04y_U3Pvyg4wV8V3d-Xkw";

        String detailsUrl = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/place/details/json")
                .queryParam("place_id", placeId)
                .queryParam("fields", "formatted_phone_number,opening_hours,formatted_address")
                .queryParam("key", googlePlacesApiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> rawResponse = restTemplate.exchange(
                detailsUrl,
                HttpMethod.GET,
                null,
                String.class
        );
        ResponseEntity<PlaceDetailsResponse> response = restTemplate.exchange(
                detailsUrl, HttpMethod.GET, null, PlaceDetailsResponse.class);

        PlaceDetailsResponse detailsResponse = response.getBody();

        Map<String, Object> detailsMap = new HashMap<>();
        if (detailsResponse != null && detailsResponse.getResult() != null) {
            detailsMap.put("phone", detailsResponse.getResult().getFormattedPhoneNumber());
            detailsMap.put("hours", detailsResponse.getResult().getOpeningHours());
            detailsMap.put("formatted_address", detailsResponse.getResult().getFormattedAddress());
        }
        return detailsMap;
    }


}
