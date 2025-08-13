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

        String address=location.get("address");
        System.out.println("Adresa primita: " + address);

        double[] coordinates = geocodeAddress(address);
        if (coordinates == null) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<Map<String, Object>> closestOffices = findClosestVeterinaryOffices(coordinates[0], coordinates[1]);
        return ResponseEntity.ok(closestOffices);
    }
    private double[] geocodeAddress(String address) {
        String googleGeocodeApiKey = "AIzaSyBi_pbMjgl7WW04y_U3Pvyg4wV8V3d-Xkw";
        address = address.trim().replaceAll("\\s+", " ");
        String url = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/geocode/json")
                .queryParam("address", address)
                .queryParam("components", "country:RO")
                .queryParam("key", googleGeocodeApiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<GoogleGeocodeResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, null, GoogleGeocodeResponse.class);

        GoogleGeocodeResponse rsp = response.getBody();
        ResponseEntity<String> res = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                String.class
        );

        System.out.println(res.getBody());

        if (rsp == null || rsp.getResults() == null || rsp.getResults().isEmpty()) {
            System.out.println("Adresă invalidă!");
            return null;
        }

        GoogleGeocodeResponse.Geometry.Location location = rsp.getResults().get(0).getGeometry().getLocation();
        return new double[]{location.getLat(), location.getLng()};
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
            officeData.put("address", place.getVicinity());
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
                .queryParam("fields", "formatted_phone_number,opening_hours")
                .queryParam("key", googlePlacesApiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlaceDetailsResponse> response = restTemplate.exchange(
                detailsUrl, HttpMethod.GET, null, PlaceDetailsResponse.class);

        PlaceDetailsResponse detailsResponse = response.getBody();

        Map<String, Object> detailsMap = new HashMap<>();
        if (detailsResponse != null && detailsResponse.getResult() != null) {
            detailsMap.put("phone", detailsResponse.getResult().getFormattedPhoneNumber());
            detailsMap.put("hours", detailsResponse.getResult().getOpeningHours());
        }
        return detailsMap;
    }


}
