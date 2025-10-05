package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
        Page<Order> findByUserId(Long userId, PageRequest pageRequest);

        // Đếm số lượng đơn hàng trong khoảng thời gian
        long countByOrderTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

        // Lấy danh sách đơn hàng đã thanh toán trong khoảng thời gian
        List<Order> findByOrderTimeBetweenAndIsPaidTrue(LocalDateTime startDate, LocalDateTime endDate);

        @Query("SELECT o FROM Order o WHERE "
                        + "(:orderId IS NULL OR o.id = :orderId) AND "
                        + "(:userId IS NULL OR o.user.id = :userId) AND "
                        + "(:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod) AND "
                        + "(:status IS NULL OR o.status = :status) AND "
                        + "(:paid IS NULL OR o.isPaid = :paid)")
        Page<Order> findAllByCriteria(@Param("orderId") Long orderId,
                        @Param("userId") Long userId,
                        @Param("paymentMethod") String paymentMethod,
                        @Param("status") String status,
                        @Param("paid") Boolean paid,
                        Pageable pageable);

        List<Order> findByUserId(Long userId);

        // Lấy tổng số lượng đã bán cho từng sản phẩm (theo danh sách productId)
        @Query("SELECT oi.product.id, SUM(oi.quantity) FROM OrderItem oi " +
                        "WHERE oi.product.id IN :productIds AND oi.order.status = 'Hoàn tất' GROUP BY oi.product.id")
        List<Object[]> findSoldQuantityByProductIds(@Param("productIds") List<Long> productIds);

}
