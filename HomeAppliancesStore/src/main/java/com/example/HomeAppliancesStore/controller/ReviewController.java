package com.example.HomeAppliancesStore.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HomeAppliancesStore.model.Review;
import com.example.HomeAppliancesStore.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Thêm đánh giá mới cho sản phẩm
    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@RequestParam(name = "productId") Long productId,
                                            @RequestParam(name = "userId") Long userId,
                                            @RequestBody Review review) {
        Review savedReview = reviewService.addReview(productId, userId, review);
        return ResponseEntity.ok(savedReview);
    }

    // Trả lời một bình luận (Review)
    @PostMapping("/reply")
    public ResponseEntity<Review> replyToReview(@RequestParam(name = "productId") Long productId,
                                                @RequestParam(name = "userId") Long userId,
                                                @RequestParam(name = "parentReviewId") Long parentReviewId,
                                                @RequestBody Review review) {
        Review savedReview = reviewService.replyToReview(productId, userId, parentReviewId, review);
        return ResponseEntity.ok(savedReview);
    }

    // Lấy tất cả đánh giá và bình luận của một sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable("productId") Long productId) {
        List<Review> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }
}
