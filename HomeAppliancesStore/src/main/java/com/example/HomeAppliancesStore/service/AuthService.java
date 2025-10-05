package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.dto.ChangePasswordRequestDTO;
import com.example.HomeAppliancesStore.model.Profile;
import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.payload.request.LoginRequest;
import com.example.HomeAppliancesStore.payload.request.SignupRequest;
import com.example.HomeAppliancesStore.payload.response.JwtResponse;
import com.example.HomeAppliancesStore.repository.UserRepository;
import com.example.HomeAppliancesStore.security.jwt.JwtUtils;
import com.example.HomeAppliancesStore.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.messaging.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private JavaMailSender mailSender;

    // Đăng nhập
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (!userOptional.isPresent()) {
            throw new RuntimeException("Tài khoản không tồn tại.");
        }

        User user = userOptional.get();

        if (user.isAccountLocked()) {
            throw new RuntimeException("Tài khoản đã bị khóa.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername(), user.getRole());

            user.setLastLoginTime(LocalDateTime.now());
            userRepository.save(user);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities());
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Mật khẩu không đúng.");
        }
    }

    // Đăng ký
    public void registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        if (userRepository.findByProfileEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());

        Profile profile = new Profile();
        profile.setFullName(signUpRequest.getFullName());
        profile.setPhoneNumber(signUpRequest.getPhoneNumber());
        profile.setEmail(signUpRequest.getEmail());
        profile.setAvatar(signUpRequest.getAvatar());
        user.setProfile(profile);

        userRepository.save(user);
    }

    private void sendEmail(String recipientEmail, String link) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        try {
            helper.setTo(recipientEmail);
            helper.setSubject("Đặt lại mật khẩu");
            helper.setText("<p>Xin chào,</p>" +
                    "<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>" +
                    "<p>Nhấn vào liên kết dưới đây để thay đổi mật khẩu:</p>" +
                    "<p><a href=\"" + link + "\">Đặt lại mật khẩu</a></p>", true);

            mailSender.send(message);
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            throw new IllegalStateException("Gửi email thất bại", e);
        }
    }

    // Quên mật khẩu
    public String forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByProfileEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            userRepository.save(user);
            String resetPasswordLink = "http://localhost:5173/reset-password?token=" + token;
            sendEmail(email, resetPasswordLink);

            return "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn";
        } else {
            return "Email không tồn tại trong hệ thống";
        }
    }

    // Đặt lại mật khẩu
    public void resetPassword(String resetToken, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(resetToken);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(encoder.encode(newPassword));
            user.setResetToken(null);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn.");
        }
    }

    // Đổi mật khẩu
    public void changePassword(Long userId, ChangePasswordRequestDTO changePasswordRequestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại."));

        if (!encoder.matches(changePasswordRequestDTO.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng.");
        }

        if (!changePasswordRequestDTO.getNewPassword().equals(changePasswordRequestDTO.getConfirmNewPassword())) {
            throw new RuntimeException("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }

        user.setPassword(encoder.encode(changePasswordRequestDTO.getNewPassword()));
        userRepository.save(user);
    }

    // Lấy thông tin người dùng
    public User getMe(String token) {
        String username = jwtUtils.getUserNameFromJwtToken(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại."));
    }
}
