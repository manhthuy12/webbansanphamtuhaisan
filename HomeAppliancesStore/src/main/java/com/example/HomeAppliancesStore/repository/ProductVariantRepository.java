package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    // Lấy danh sách biến thể theo sản phẩm
    List<ProductVariant> findByProductId(Long productId);

    // Tìm biến thể theo ID (có kiểm tra trạng thái xóa nếu cần)
    Optional<ProductVariant> findByIdAndDeletedFalse(Long id);
}
