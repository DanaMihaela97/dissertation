package org.example.apichat.dto.places;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LocationByLatLon {

    @JsonProperty("lat")
    private double lat;

    @JsonProperty("lng")
    private double lng;


}