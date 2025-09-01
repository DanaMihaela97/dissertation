package com.example.apilocation.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GoogleGeocodeResponse {

    private List<Result> results;

    public static class Result {
        private Geometry geometry;

        public Geometry getGeometry() {
            return geometry;
        }

        public void setGeometry(Geometry geometry) {
            this.geometry = geometry;
        }
    }

    public static class Geometry {
        @Getter
        @Setter
        private Location location;
        private String location_type;

        public String getLocationType() {
            return location_type;
        }

        public void setLocationType(String location_type) {
            this.location_type = location_type;
        }

        @Getter
        public static class Location {
            private double lat;
            private double lng;

            public void setLat(double lat) {
                this.lat = lat;
            }

            public void setLng(double lng) {
                this.lng = lng;
            }
        }
    }
}