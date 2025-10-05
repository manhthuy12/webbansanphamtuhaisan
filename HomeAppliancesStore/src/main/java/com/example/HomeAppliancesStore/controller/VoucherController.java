package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.Voucher;
import com.example.HomeAppliancesStore.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    // Tìm kiếm voucher với phân trang
    @GetMapping
    public ResponseEntity<?> searchVouchers(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<Voucher> vouchers = voucherService.searchVouchers(code, page, size);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tìm kiếm vouchers: " + e.getMessage());
        }
    }

    // Lấy voucher theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVoucherById(@PathVariable("id") Long id) {
        try {
            Optional<Voucher> voucherOptional = voucherService.getVoucherById(id);
            if (voucherOptional.isPresent()) {
                return ResponseEntity.ok(voucherOptional.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voucher không tồn tại với ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lấy thông tin voucher: " + e.getMessage());
        }
    }

    // Tìm kiếm voucher dựa trên mã code
    @GetMapping("/by-code/{code}")
    public ResponseEntity<?> getVoucherByCode(@PathVariable("code") String code) {
        try {
            Optional<Voucher> voucherOptional = voucherService.getVoucherByCode(code);
            if (voucherOptional.isPresent()) {
                return ResponseEntity.ok(voucherOptional.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voucher không tồn tại với mã code: " + code);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tìm kiếm voucher theo mã code: " + e.getMessage());
        }
    }

    // Tạo mới voucher
    @PostMapping
    public ResponseEntity<?> createVoucher(@Valid @RequestBody Voucher voucher, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errors.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            Voucher createdVoucher = voucherService.createVoucher(voucher);
            return ResponseEntity.ok(createdVoucher);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi tạo voucher: " + e.getMessage());
        }
    }

    // Cập nhật voucher
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable("id") Long id, @Valid @RequestBody Voucher voucherDetails,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errors.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            Voucher updatedVoucher = voucherService.updateVoucher(id, voucherDetails);
            return ResponseEntity.ok(updatedVoucher);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật voucher: " + e.getMessage());
        }
    }

    // Xóa voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable("id") Long id) {
        try {
            voucherService.deleteVoucher(id);
            return ResponseEntity.ok("Voucher đã được xóa thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa voucher: " + e.getMessage());
        }
    }
}
