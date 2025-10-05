package com.example.HomeAppliancesStore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.HomeAppliancesStore.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class VNPayController {

    private final VNPayService vnpayService;

    // Constructor Injection
    public VNPayController(VNPayService vnpayService) {
        this.vnpayService = vnpayService;
    }

    @GetMapping("/api/vnpay/payment")
    public String createPayment(@RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            @RequestParam("returnUrl") String returnUrl,
            HttpServletRequest request) throws Exception {
        // Gọi VNPAYService và truyền request để tạo URL thanh toán
        return vnpayService.createOrder(request, amount, orderInfo, returnUrl);
    }

    @GetMapping("/api/vnpay/paymentReturn")
    public String paymentReturn(HttpServletRequest request) {
        // Xử lý logic khi VNPay trả về sau khi thanh toán
        int result = vnpayService.orderReturn(request);
        if (result == 1) {
            return "Giao dịch thành công!";
        } else if (result == 0) {
            return "Giao dịch thất bại!";
        } else {
            return "Giao dịch không hợp lệ!";
        }
    }
}
