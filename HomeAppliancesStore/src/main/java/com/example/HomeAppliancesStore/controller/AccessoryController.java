package com.example.HomeAppliancesStore.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.example.HomeAppliancesStore.model.Accessory;
import com.example.HomeAppliancesStore.service.AccessoryService;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/accessories")
public class AccessoryController {

    @Autowired
    private AccessoryService accessoryService;

    // Tìm kiếm phụ kiện theo tên với phân trang
    @GetMapping
    public ResponseEntity<?> searchAccessories(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<Accessory> accessories = accessoryService.searchAccessories(name, page, size);
            return ResponseEntity.ok(accessories);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tìm kiếm phụ kiện: " + e.getMessage());
        }
    }

    // Lấy phụ kiện theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccessoryById(@PathVariable("id") Long id) {
        try {
            Optional<Accessory> accessoryOptional = accessoryService.getAccessoryById(id);
            if (accessoryOptional.isPresent()) {
                return ResponseEntity.ok(accessoryOptional.get());
            } else {
                return ResponseEntity.badRequest().body("Phụ kiện không tồn tại.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy phụ kiện: " + e.getMessage());
        }
    }

    // Tạo mới phụ kiện
    @PostMapping
    public ResponseEntity<?> createAccessory(@Valid @RequestBody Accessory accessory, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }
        try {
            Accessory createdAccessory = accessoryService.createAccessory(accessory);
            return ResponseEntity.ok(createdAccessory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo phụ kiện: " + e.getMessage());
        }
    }

    // Cập nhật phụ kiện theo ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccessory(@PathVariable("id") Long id,
            @Valid @RequestBody Accessory accessoryDetails,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Optional<Accessory> updatedAccessoryOptional = accessoryService.updateAccessory(id, accessoryDetails);
            if (updatedAccessoryOptional.isPresent()) {
                return ResponseEntity.ok(updatedAccessoryOptional.get());
            } else {
                return ResponseEntity.badRequest()
                        .body("Cập nhật phụ kiện không thành công hoặc phụ kiện không tồn tại.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật phụ kiện: " + e.getMessage());
        }
    }

    // Xóa phụ kiện theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccessory(@PathVariable("id") Long id) {
        try {
            accessoryService.deleteAccessory(id);
            return ResponseEntity.ok("Phụ kiện đã được xóa.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa phụ kiện: " + e.getMessage());
        }
    }
}
