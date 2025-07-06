package org.example.apichat.service.impl;

import org.example.apichat.entity.Review;

import java.util.List;

public interface ReviewService {
    Review saveReview(Review review);
    List<Review> getReviews();
    float reviewMean();
}
