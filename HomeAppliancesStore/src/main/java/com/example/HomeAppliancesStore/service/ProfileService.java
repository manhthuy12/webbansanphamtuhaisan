package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.model.Profile;
import com.example.HomeAppliancesStore.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    // Tìm kiếm profile với phân trang
    public Page<Profile> searchProfiles(String name, String phoneNumber, String email, int page, int size) {
        return profileRepository.searchProfiles(name, phoneNumber, email, PageRequest.of(page, size, Sort.by("id").descending()));
    }
    
    // Lấy profile theo ID
    public Optional<Profile> findById(Long id) {
        return profileRepository.findById(id);
    }

    // Tạo mới profile với URL avatar
    public Profile createProfile(Profile profile) {
        // Lưu trực tiếp URL avatar vào profile
        return profileRepository.save(profile);
    }

    // Cập nhật profile theo ID với URL avatar
    public Profile updateProfile(Long id, Profile profileDetails) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found with id " + id));

        // Cập nhật các thông tin của profile
        profile.setFullName(profileDetails.getFullName());
        profile.setPhoneNumber(profileDetails.getPhoneNumber());
        profile.setEmail(profileDetails.getEmail());

        // Cập nhật URL avatar nếu có thay đổi
        if (profileDetails.getAvatar() != null) {
            profile.setAvatar(profileDetails.getAvatar());
        }

        return profileRepository.save(profile);
    }

    // Xóa profile theo ID
    public void deleteProfile(Long id) {
        profileRepository.deleteById(id);
    }
}
