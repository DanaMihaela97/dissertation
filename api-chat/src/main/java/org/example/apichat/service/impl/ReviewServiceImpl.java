package org.example.apichat.service.impl;

import org.example.apichat.entity.Review;
import org.example.apichat.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Review saveReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating invalid");
        }
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public float reviewMean() {
        List<Review> allReviews = reviewRepository.findAll();
        if (allReviews.isEmpty()) {
            return 0;
        }
        float sum = 0;
        for (Review review : allReviews) {
            sum += review.getRating();
        }
        return sum / allReviews.size();
    }

}
