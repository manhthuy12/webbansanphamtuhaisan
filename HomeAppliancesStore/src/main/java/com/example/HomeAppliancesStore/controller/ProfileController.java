package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.Profile;
import com.example.HomeAppliancesStore.service.ProfileService;
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
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // Tìm kiếm profiles với phân trang
    @GetMapping
    public ResponseEntity<?> searchProfiles(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<Profile> profiles = profileService.searchProfiles(name, phoneNumber, email, page, size);
            return ResponseEntity.ok(profiles);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tìm kiếm profiles: " + e.getMessage());
        }
    }

    // Lấy profile theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable("id") Long id) {
        try {
            Optional<Profile> profileOptional = profileService.findById(id);
            if (profileOptional.isPresent()) {
                return ResponseEntity.ok(profileOptional.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile không tồn tại.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin profile: " + e.getMessage());
        }
    }

    // Tạo mới profile
    @PostMapping
    public ResponseEntity<?> createProfile(@Valid @RequestBody Profile profile, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Profile createdProfile = profileService.createProfile(profile);
            return ResponseEntity.ok(createdProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo profile: " + e.getMessage());
        }
    }

    // Cập nhật profile theo ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable("id") Long id,
            @Valid @RequestBody Profile profileDetails,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Profile updatedProfile = profileService.updateProfile(id, profileDetails);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật profile: " + e.getMessage());
        }
    }

    // Xóa profile theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable("id") Long id) {
        try {
            profileService.deleteProfile(id);
            return ResponseEntity.ok("Profile đã được xóa thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa profile: " + e.getMessage());
        }
    }
}
