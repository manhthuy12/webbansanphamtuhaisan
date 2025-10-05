package com.example.HomeAppliancesStore.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HomeAppliancesStore.model.Product;
import com.example.HomeAppliancesStore.model.Review;
import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.repository.ProductRepository;
import com.example.HomeAppliancesStore.repository.ReviewRepository;
import com.example.HomeAppliancesStore.repository.UserRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Thêm đánh giá mới cho sản phẩm
    public Review addReview(Long productId, Long userId, Review review) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm tìm thấy user"));

        review.setProduct(product);
        review.setUser(user);
        review.setReviewTime(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    // Trả lời một bình luận (Review)
    public Review replyToReview(Long productId, Long userId, Long parentReviewId, Review review) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm tìm thấy user"));
        Review parentReview = reviewRepository.findById(parentReviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận trước đó"));

        review.setParentReview(parentReview);
        review.setProduct(product);
        review.setUser(user);
        review.setReviewTime(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        return reviewRepository.findByProductAndParentReviewIsNull(product);
    }
}

