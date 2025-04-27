package org.example.apichat.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GooglePlacesResponse {
    @JsonProperty("results")
    private List<Place> results;

    @JsonProperty("status")
    private String status;

    public void setResults(List<Place> results) {
        this.results = results;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Place> getResults() {
        return results;
    }

    public String getStatus() {
        return status;
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class Place {
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


    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBusinessStatus() { return businessStatus; }
    public void setBusinessStatus(String businessStatus) { this.businessStatus = businessStatus; }

    public String getVicinity() { return vicinity; }
    public void setVicinity(String vicinity) { this.vicinity = vicinity; }

    public GoogleGeocodeResponse.Geometry getGeometry() { return geometry; }
    public void setGeometry(GoogleGeocodeResponse.Geometry geometry) { this.geometry = geometry; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }


}


class GoogleGeocodeResponse {
    private List<Result> results;

    public List<Result> getResults() { return results; }
    public void setResults(List<Result> results) { this.results = results; }

    static class Result {
        private Geometry geometry;
        public Geometry getGeometry() { return geometry; }
        public void setGeometry(Geometry geometry) { this.geometry = geometry; }
    }

    static class Geometry {
        private Location location;
        public Location getLocation() { return location; }
        public void setLocation(Location location) { this.location = location; }

        static class Location {
            private double lat;
            private double lng;

            public double getLat() { return lat; }
            public void setLat(double lat) { this.lat = lat; }

            public double getLng() { return lng; }
            public void setLng(double lng) { this.lng = lng; }
        }
    }
}

@JsonIgnoreProperties (ignoreUnknown = true)
class Location {
    @JsonProperty("address")
    private String address;
    public String getAddress() { return address; }
}

@JsonIgnoreProperties(ignoreUnknown = true)
class LocationByLatLon {
    @JsonProperty("lat")
    private double lat;

    @JsonProperty("lng")
    private double lng;

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
}
