package com.example.HomeAppliancesStore.service;

import org.springframework.stereotype.Service;

import com.example.HomeAppliancesStore.model.Profile;
import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.payload.request.CreateUserRequest;
import com.example.HomeAppliancesStore.repository.UserRepository;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private PasswordEncoder encoder;

    public Page<User> getUsers(String username, int page, int size) {
        if (username != null && !username.isEmpty()) {
            return userRepository.findByUsernameContaining(username,
                    PageRequest.of(page, size, Sort.by("id").descending()));
        } else {
            return userRepository.findAll(PageRequest.of(page, size, Sort.by("id").descending()));
        }
    }

    // Khóa tài khoản
    // Khóa hoặc mở khóa tài khoản
    public boolean lockAccount(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Đảo ngược trạng thái khóa tài khoản
            user.setAccountLocked(!user.isAccountLocked());
            userRepository.save(user);
            return true;
        } else {
            throw new RuntimeException("Tài khoản không tồn tại.");
        }
    }

    // Lấy thông tin tài khoản theo ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Tạo tài khoản mới với profile
    public User createUserWithProfile(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        Optional<Profile> profileOptional = profileService.findById(request.getProfileId());
        if (!profileOptional.isPresent()) {
            throw new RuntimeException("Profile không tồn tại.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setProfile(profileOptional.get());
        user.setAccountLocked(false);
        user.setRole(request.getRole() != null ? request.getRole() : "USER"); // Thiết lập role từ request

        return userRepository.save(user);
    }

    // Cập nhật thông tin người dùng
    public User editUser(Long id, CreateUserRequest request) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Kiểm tra tên đăng nhập mới (nếu có)
            if (request.getUsername() != null && !user.getUsername().equals(request.getUsername())
                    && userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Tên đăng nhập đã tồn tại!");
            }

            // Chỉ cập nhật vai trò nếu có giá trị mới
            if (request.getRole() != null) {
                user.setRole(request.getRole());
            }

            // Kiểm tra và cập nhật Profile nếu có ID profile mới
            if (request.getProfileId() != null) {
                Optional<Profile> profileOptional = profileService.findById(request.getProfileId());
                if (profileOptional.isPresent()) {
                    user.setProfile(profileOptional.get());
                } else {
                    throw new RuntimeException("Profile không tồn tại.");
                }
            }

            // Lưu các thay đổi vào cơ sở dữ liệu
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Người dùng không tồn tại.");
        }
    }

}
