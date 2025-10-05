package com.example.HomeAppliancesStore.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Phương thức gửi email xác nhận đơn hàng với nội dung HTML
    public void sendOrderConfirmationEmail(String toEmail, String subject, String htmlContent)
            throws MessagingException {
        // Tạo đối tượng MimeMessage để gửi email dạng HTML
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        // Thiết lập thông tin email
        helper.setTo(toEmail); // Địa chỉ email người nhận
        helper.setSubject(subject); // Tiêu đề email
        helper.setText(htmlContent, true); // Nội dung email dạng HTML

        // Địa chỉ email người gửi (thay thế bằng email thực tế)
        helper.setFrom("HomeAppliances <homeappliances@gmail.com>");

        // Gửi email
        mailSender.send(mimeMessage);
    }
}
