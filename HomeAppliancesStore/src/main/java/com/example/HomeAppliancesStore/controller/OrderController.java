package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.Order;
import com.example.HomeAppliancesStore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessagingException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Lấy danh sách đơn hàng với phân trang và tìm kiếm theo userId
    @GetMapping
    public ResponseEntity<?> searchOrders(
            @RequestParam(value = "orderId", required = false) Long orderId,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "paymentMethod", required = false) String paymentMethod,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "paid", required = false) Boolean paid,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<Order> orders = orderService.searchOrders(orderId, userId, paymentMethod, status, paid, page, size);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
        }
    }

    @PostMapping("/sendOrderConfirmation")
    public ResponseEntity<String> sendOrderConfirmationEmail(
            @RequestParam Long orderId) throws MessagingException, jakarta.mail.MessagingException {

        // Gọi EmailService để gửi email xác nhận
        orderService.sendOrderConfirmationEmail(orderId);

        return ResponseEntity.ok("Email xác nhận đơn hàng đã được gửi thành công!");
    }

    // Tạo mới đơn hàng với người đặt hàng
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody Order order,
            @RequestParam("userId") Long userId,
            @RequestParam("addressId") Long addressId,
            @RequestParam(value = "voucherCode", required = false) String voucherCode,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ");
        }

        try {
            Order createdOrder = orderService.createOrder(order, userId, voucherCode, addressId);
            return ResponseEntity.ok(createdOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/offline")
    public ResponseEntity<?> createOrderOffline(@Valid @RequestBody Order order,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "voucherCode", required = false) String voucherCode,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ");
        }

        try {
            Order createdOrder = orderService.createOrderOffline(order, userId, voucherCode);
            return ResponseEntity.ok(createdOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật trạng thái đơn hàng
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable("id") Long id,
            @RequestParam("status") String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    // Cập nhật trạng thái thanh toán
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderPaid(@PathVariable("id") Long id) {
        try {
            Order updatedOrder = orderService.updateOrderPaid(id);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    // Xem chi tiết đơn hàng
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi: " + e.getMessage());
        }
    }
}
