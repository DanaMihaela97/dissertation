package org.example.apichat.service;

import org.example.apichat.entity.Review;

import java.util.List;

public interface ReviewService {
    Review saveReview(Review review);
    List<Review> getReviews();
    float reviewMean();
}
