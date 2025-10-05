package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.dto.ChangePasswordRequestDTO;
import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.payload.request.LoginRequest;
import com.example.HomeAppliancesStore.payload.request.SignupRequest;
import com.example.HomeAppliancesStore.payload.response.JwtResponse;
import com.example.HomeAppliancesStore.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors().forEach(error -> errorMessages.add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            authService.registerUser(signUpRequest);
            return ResponseEntity.ok("Đăng ký tài khoản thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam("email") String email) {
        return authService.forgotPassword(email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("token") String resetToken,
            @RequestParam("newPassword") String newPassword) {
        try {
            authService.resetPassword(resetToken, newPassword);
            return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/change-password/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable("userId") Long userId,
            @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        try {
            authService.changePassword(userId, changePasswordRequestDTO);
            return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String token) {
        try {
            User user = authService.getMe(token.substring(7));
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
