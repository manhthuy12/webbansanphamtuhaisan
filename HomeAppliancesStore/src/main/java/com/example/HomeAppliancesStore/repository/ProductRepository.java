package com.example.HomeAppliancesStore.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.HomeAppliancesStore.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
        @Query("SELECT p FROM Product p WHERE "
                        + "(:name IS NULL OR p.name LIKE %:name%) "
                        + "AND (:categoryIdList IS NULL OR p.category.id IN :categoryIdList) "
                        + "AND (:minPrice IS NULL OR p.price >= :minPrice) "
                        + "AND (:maxPrice IS NULL OR p.price <= :maxPrice) "
                        + "AND (:hot IS NULL OR p.hot = :hot) "
                        + "AND (:sale IS NULL OR p.sale = :sale) "
                        + "AND p.deleted = false")
        Page<Product> searchProducts(
                        @Param("name") String name,
                        @Param("categoryIdList") List<Long> categoryIdList,
                        @Param("minPrice") Double minPrice,
                        @Param("maxPrice") Double maxPrice,
                        @Param("hot") Boolean hot,
                        @Param("sale") Boolean sale,
                        Pageable pageable);

        List<Product> findAllByDeletedFalse();

        long countByDeletedFalse();
}
