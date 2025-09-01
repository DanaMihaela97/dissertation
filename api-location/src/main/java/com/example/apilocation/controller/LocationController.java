package com.example.apilocation.controller;

import com.example.apilocation.service.LocationService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/locate")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping("/locateVeterinaryOffices")
    public ResponseEntity<List<Map<String, Object>>> locateVeterinaryOffices(@RequestBody Map<String, String> location) {
        double[] coordinates = locationService.geocodeAddress(location);
        if (coordinates == null) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<Map<String, Object>> closestOffices =
                locationService.findClosestVeterinaryOffices(coordinates[0], coordinates[1]);

        return ResponseEntity.ok(closestOffices);
    }
}