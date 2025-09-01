package com.example.apilocation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlaceDetailsResponse {

    @JsonProperty("result")
    private Result result;

    @Setter
    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        @JsonProperty("formatted_address")
        private String formattedAddress;

        @JsonProperty("formatted_phone_number")
        private String formattedPhoneNumber;


        @JsonProperty("opening_hours")
        private OpeningHours openingHours;


        @Setter
        @Getter
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class OpeningHours {
            @JsonProperty("weekday_text")
            private List<String> weekdayText;

        }
    }
    }