package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.model.*;
import com.example.HomeAppliancesStore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.text.DecimalFormat;
import java.time.LocalDate;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private AddressBookRepository addressBookRepository;
    @Autowired
    private EmailService emailService;

    public Page<Order> searchOrders(Long orderId, Long userId, String paymentMethod, String status, Boolean paid,
            int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        return orderRepository.findAllByCriteria(orderId, userId, paymentMethod, status, paid, pageRequest);
    }

    @Transactional
    public Order createOrder(Order order, Long userId, String voucherCode, Long addressId) {
        double total = 0;

        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Lấy địa chỉ giao hàng
        AddressBook address = addressBookRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));

        // Gán thông tin cơ bản cho order
        order.setUser(user);
        order.setStatus("Chờ xác nhận");
        order.setOrderType(OrderType.ONLINE);
        order.setOrderTime(LocalDateTime.now());
        order.setAddressBook(address);

        // Xử lý từng sản phẩm trong đơn hàng
        for (OrderItem item : order.getOrderItems()) {
            item.setOrder(order);

            // Kiểm tra sản phẩm có tồn tại
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            ProductVariant variant = null;

            if (item.getVariant() != null) {
                // Nếu có biến thể
                variant = productVariantRepository.findById(item.getVariant().getId())
                        .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm không tồn tại"));

                if (variant.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ số lượng biến thể sản phẩm trong kho");
                }

                // ✅ Trừ tồn kho của biến thể
                variant.setQuantity(variant.getQuantity() - item.getQuantity());
                productVariantRepository.save(variant);

                // ✅ Trừ tồn kho tổng của sản phẩm
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ số lượng sản phẩm trong kho");
                }
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);

                // Lấy giá từ biến thể
                item.setPriceAtPurchase(variant.getPrice());
            } else {
                // Không có biến thể => trừ kho sản phẩm chính
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ số lượng sản phẩm trong kho");
                }
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);

                // Giá lấy từ sản phẩm
                item.setPriceAtPurchase(product.isSale() ? product.getSalePrice() : product.getPrice());
            }

            // Cộng vào tổng tiền
            total += item.getQuantity() * item.getPriceAtPurchase();
        }

        // Áp dụng mã giảm giá nếu có
        if (voucherCode != null && !voucherCode.isEmpty()) {
            Voucher voucher = voucherRepository.findByCodeAndIsActive(voucherCode, true)
                    .orElseThrow(() -> new RuntimeException("Mã giảm giá không hợp lệ hoặc đã hết hạn"));

            if (voucher.getEndDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn");
            }

            if (voucher.getDiscountValue() <= 100) {
                total *= (1 - voucher.getDiscountValue() / 100.0);
            } else {
                total -= voucher.getDiscountValue();
                if (total < 0)
                    total = 0;
            }

            order.setVoucher(voucher);
        }

        // Cập nhật tổng tiền đơn hàng
        order.setTotalAmount(total);

        // ✅ Tích điểm cho người dùng
        int earnedPoints = (int) (total / 1000);
        user.setPoints(user.getPoints() + earnedPoints);
        userRepository.save(user);

        // Lưu đơn hàng
        return orderRepository.save(order);
    }

    @Transactional
    public Order createOrderOffline(Order order, Long userId, String voucherCode) {
        double total = 0;

        // Lấy thông tin người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        AddressBook storeAddress = addressBookRepository.findById(20L)
                .orElseThrow(() -> new RuntimeException("Địa chỉ cửa hàng chưa được cấu hình"));

        // Gán thông tin cơ bản cho order
        order.setUser(user);
        order.setStatus("Hoàn tất");
        order.setOrderType(OrderType.OFFLINE);
        order.setOrderTime(LocalDateTime.now());
        order.setAddressBook(storeAddress);
        order.setPaid(true);

        // Xử lý từng sản phẩm trong đơn hàng
        for (OrderItem item : order.getOrderItems()) {
            item.setOrder(order);

            // Kiểm tra sản phẩm có tồn tại
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            ProductVariant variant = null;

            if (item.getVariant() != null) {
                // Nếu có biến thể
                variant = productVariantRepository.findById(item.getVariant().getId())
                        .orElseThrow(() -> new RuntimeException("Biến thể sản phẩm không tồn tại"));

                if (variant.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ số lượng biến thể sản phẩm trong kho");
                }

                // ✅ Trừ tồn kho của biến thể
                variant.setQuantity(variant.getQuantity() - item.getQuantity());
                productVariantRepository.save(variant);

                // ✅ Trừ tồn kho tổng của sản phẩm
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ số lượng sản phẩm trong kho");
                }
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);

                // Lấy giá từ biến thể
                item.setPriceAtPurchase(variant.getPrice());
            } else {
                // Không có biến thể => trừ kho sản phẩm chính
                if (product.getQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Không đủ số lượng sản phẩm trong kho");
                }
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);

                // Giá lấy từ sản phẩm
                item.setPriceAtPurchase(product.isSale() ? product.getSalePrice() : product.getPrice());
            }

            // Cộng vào tổng tiền
            total += item.getQuantity() * item.getPriceAtPurchase();
        }

        // Áp dụng mã giảm giá nếu có
        if (voucherCode != null && !voucherCode.isEmpty()) {
            Voucher voucher = voucherRepository.findByCodeAndIsActive(voucherCode, true)
                    .orElseThrow(() -> new RuntimeException("Mã giảm giá không hợp lệ hoặc đã hết hạn"));

            if (voucher.getEndDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn");
            }

            if (voucher.getDiscountValue() <= 100) {
                total *= (1 - voucher.getDiscountValue() / 100.0);
            } else {
                total -= voucher.getDiscountValue();
                if (total < 0)
                    total = 0;
            }

            order.setVoucher(voucher);
        }

        // Cập nhật tổng tiền đơn hàng
        order.setTotalAmount(total);

        // ✅ Tích điểm cho người dùng
        int earnedPoints = (int) (total / 1000);
        user.setPoints(user.getPoints() + earnedPoints);
        userRepository.save(user);

        // Lưu đơn hàng
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order updateOrderPaid(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setPaid(true);
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    public List<Product> getPurchasedProducts(Long userId) {
        List<Order> userOrders = orderRepository.findByUserId(userId);
        return userOrders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .map(orderItem -> orderItem.getProduct())
                .distinct()
                .collect(Collectors.toList());
    }

    public void sendOrderConfirmationEmail(Long orderId) throws jakarta.mail.MessagingException {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found with code: " + orderId);
        }

        Order order = optionalOrder.get();
        DecimalFormat df = new DecimalFormat("#,###");

        // Lấy giá trị giảm giá từ voucher (nếu có)
        double discountValue = (order.getVoucher() != null) ? order.getVoucher().getDiscountValue() : 0.0;

        // Tính tổng tiền trước khi giảm giá
        double subtotal = order.getOrderItems().stream()
                .mapToDouble(item -> item.getPriceAtPurchase() * item.getQuantity())
                .sum();

        // Tính số tiền được giảm giá
        double discountAmount = discountValue <= 100 ? (subtotal * discountValue / 100) : discountValue;

        // Tính tổng tiền sau khi giảm giá
        double totalAfterDiscount = Math.max(subtotal - discountAmount, 0);

        // Tạo nội dung HTML cho email
          StringBuilder htmlContent = new StringBuilder();

    htmlContent.append("<div style='font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;'>")
        .append("<h2 style='text-align: center; color: #FFBB38;'>HÓA ĐƠN BÁN HÀNG</h2>")
        .append("<p><strong>Mã đơn hàng:</strong> #ORD").append(order.getId()).append("</p>")
        .append("<p><strong>Ngày đặt:</strong> ").append(order.getOrderTime().toLocalDate()).append("</p>")
        .append("<hr style='border: none; border-top: 1px solid #ccc;'>")

        .append("<h3>Thông tin khách hàng</h3>")
        .append("<p><strong>Người nhận:</strong> ").append(order.getAddressBook().getRecipientName()).append("</p>")
        .append("<p><strong>Địa chỉ:</strong> ")
        .append(order.getAddressBook().getAddress()).append(", ")
        .append(order.getAddressBook().getWard()).append(", ")
        .append(order.getAddressBook().getDistrict()).append(", ")
        .append(order.getAddressBook().getCity()).append("</p>")
        .append("<p><strong>Số điện thoại:</strong> ").append(order.getAddressBook().getPhoneNumber()).append("</p>")

        .append("<h3>Chi tiết đơn hàng</h3>")
        .append("<table style='width: 100%; border-collapse: collapse;'>")
        .append("<thead><tr>")
        .append("<th style='border: 1px solid #ccc; padding: 8px;'>Sản phẩm</th>")
        .append("<th style='border: 1px solid #ccc; padding: 8px;'>Lựa chọn</th>")
        .append("<th style='border: 1px solid #ccc; padding: 8px;'>Số lượng</th>")
        .append("<th style='border: 1px solid #ccc; padding: 8px;'>Đơn giá</th>")
        .append("<th style='border: 1px solid #ccc; padding: 8px;'>Thành tiền</th>")
        .append("</tr></thead>")
        .append("<tbody>");

    for (OrderItem item : order.getOrderItems()) {
        htmlContent.append("<tr>")
            .append("<td style='border: 1px solid #ccc; padding: 8px;'>").append(item.getProduct().getName()).append("</td>")
            .append("<td style='border: 1px solid #ccc; padding: 8px;'>")
            .append(item.getVariant() != null ? item.getVariant().getName() : "-").append("</td>")
            .append("<td style='border: 1px solid #ccc; padding: 8px; text-align: center;'>").append(item.getQuantity()).append("</td>")
            .append("<td style='border: 1px solid #ccc; padding: 8px; text-align: right;'>").append(df.format(item.getPriceAtPurchase())).append("₫</td>")
            .append("<td style='border: 1px solid #ccc; padding: 8px; text-align: right;'>")
            .append(df.format(item.getPriceAtPurchase() * item.getQuantity())).append("₫</td>")
            .append("</tr>");
    }

    htmlContent.append("</tbody></table>")

        .append("<h3>Tóm tắt thanh toán</h3>")
        .append("<p><strong>Tạm tính:</strong> ").append(df.format(subtotal)).append("₫</p>")
        .append("<p><strong>Giảm giá:</strong> -").append(df.format(discountAmount)).append("₫</p>")
        .append("<p><strong>Tổng cộng:</strong> <span style='color: #FFBB38; font-size: 18px;'>")
        .append(df.format(totalAfterDiscount)).append("₫</span></p>")

        .append("<h3>Phương thức thanh toán</h3>")
        .append("<p>").append(order.getPaymentMethod()).append("</p>")

        .append("<h3>Trạng thái đơn hàng</h3>")
        .append("<p>").append(order.getStatus()).append("</p>")

        .append("<hr style='border: none; border-top: 1px solid #ccc;'>")
        .append("<p style='font-size: 12px; text-align: center;'>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</p>")
        .append("</div>");

    emailService.sendOrderConfirmationEmail(
            order.getUser().getProfile().getEmail(),
            "Hóa đơn đơn hàng - #ORD" + order.getId(),
            htmlContent.toString());
    }

}
