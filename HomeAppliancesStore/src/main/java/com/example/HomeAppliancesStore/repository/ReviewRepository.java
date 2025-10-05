package com.example.HomeAppliancesStore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.HomeAppliancesStore.model.Product;
import com.example.HomeAppliancesStore.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
    List<Review> findByProductAndParentReviewIsNull(Product product);
}
