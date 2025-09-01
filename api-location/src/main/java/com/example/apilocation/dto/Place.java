package com.example.apilocation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Place {

    @JsonProperty("name")
    private String name;

    @JsonProperty("business_status")
    private String businessStatus;

    @JsonProperty("vicinity")
    private String vicinity;

    @JsonProperty("geometry")
    private GoogleGeocodeResponse.Geometry geometry;

    @JsonProperty("place_id")
    private String placeId;

}