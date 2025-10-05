package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.payload.request.CreateUserRequest;
import com.example.HomeAppliancesStore.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Lấy danh sách user
    @GetMapping("/list")
    public ResponseEntity<?> getUsers(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<User> users = userService.getUsers(username, page, size);
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách tài khoản: " + e.getMessage());
        }
    }

    // Khóa tài khoản theo ID
    @PutMapping("/{id}/lock")
    public ResponseEntity<?> lockAccount(@PathVariable("id") Long id) {
        try {
            boolean isLocked = userService.lockAccount(id);
            if (isLocked) {
                return ResponseEntity.ok("Tài khoản đã được khóa.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không tồn tại.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi khóa tài khoản: " + e.getMessage());
        }
    }

    // Lấy thông tin tài khoản theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        try {
            Optional<User> userOptional = userService.getUserById(id);
            if (userOptional.isPresent()) {
                return ResponseEntity.ok(userOptional.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không tồn tại.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin tài khoản: " + e.getMessage());
        }
    }

    // Tạo tài khoản mới với profile
    @PostMapping
    public ResponseEntity<?> createUserWithProfile(@Valid @RequestBody CreateUserRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            User user = userService.createUserWithProfile(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo tài khoản: " + e.getMessage());
        }
    }

    // Cập nhật thông tin tài khoản
    @PutMapping("/{id}/edit")
    public ResponseEntity<?> editUser(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateUserRequest request,
            BindingResult bindingResult) {

        // Kiểm tra lỗi từ request
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            User updatedUser = userService.editUser(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật tài khoản: " + e.getMessage());
        }
    }

}
