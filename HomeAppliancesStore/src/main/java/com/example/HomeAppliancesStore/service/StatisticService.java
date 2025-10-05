package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.dto.BestSellingProductDTO;
import com.example.HomeAppliancesStore.dto.StatisticDTO;
import com.example.HomeAppliancesStore.model.Order;
import com.example.HomeAppliancesStore.model.OrderItem;
import com.example.HomeAppliancesStore.model.Product;
import com.example.HomeAppliancesStore.repository.OrderRepository;
import com.example.HomeAppliancesStore.repository.ProductRepository;
import com.example.HomeAppliancesStore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class StatisticService {

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private UserRepository userRepository;

        public StatisticDTO getStatistics(LocalDateTime startDate, LocalDateTime endDate) {
                StatisticDTO statistics = new StatisticDTO();

                // Tổng số lượng sản phẩm
                long totalProducts = productRepository.countByDeletedFalse();
                statistics.setTotalProducts(totalProducts);

                // Tổng số đơn hàng trong khoảng thời gian startDate - endDate
                long totalOrders = orderRepository.countByOrderTimeBetween(startDate, endDate);
                statistics.setTotalOrders(totalOrders);

                // Tổng số người dùng
                long totalUsers = userRepository.count();
                statistics.setTotalUsers(totalUsers);

                // Tổng doanh thu trong khoảng thời gian startDate - endDate (chỉ tính đơn hàng đã thanh toán)
                double totalRevenue = orderRepository.findByOrderTimeBetweenAndIsPaidTrue(startDate, endDate).stream()
                                .mapToDouble(order -> order.getTotalAmount()).sum();
                statistics.setTotalRevenue(totalRevenue);

                // Doanh thu theo từng ngày trong khoảng thời gian
                Map<LocalDate, Double> dailyRevenue = calculateDailyRevenue(startDate.toLocalDate(),
                                endDate.toLocalDate());
                statistics.setDailyRevenue(dailyRevenue);

                // Doanh thu ngày hôm nay và so sánh với hôm qua
                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime yesterdayStart = todayStart.minusDays(1);
                double todayRevenue = orderRepository
                                .findByOrderTimeBetweenAndIsPaidTrue(todayStart, LocalDateTime.now()).stream()
                                .mapToDouble(order -> order.getTotalAmount()).sum();
                double yesterdayRevenue = orderRepository
                                .findByOrderTimeBetweenAndIsPaidTrue(yesterdayStart, todayStart).stream()
                                .mapToDouble(order -> order.getTotalAmount()).sum();
                statistics.setTodayRevenue(todayRevenue);
                statistics.setTodayRevenueChangePercentage(calculatePercentageChange(todayRevenue, yesterdayRevenue));

                // Doanh thu tháng này và so sánh với tháng trước
                YearMonth thisMonth = YearMonth.now();
                YearMonth lastMonth = thisMonth.minusMonths(1);
                double thisMonthRevenue = calculateMonthlyRevenue(thisMonth);
                double lastMonthRevenue = calculateMonthlyRevenue(lastMonth);
                statistics.setMonthlyRevenue(thisMonthRevenue);
                statistics.setMonthlyRevenueChangePercentage(
                                calculatePercentageChange(thisMonthRevenue, lastMonthRevenue));

                // Doanh thu năm nay và so sánh với năm trước
                int thisYear = LocalDate.now().getYear();
                int lastYear = thisYear - 1;
                double thisYearRevenue = calculateYearlyRevenue(thisYear);
                double lastYearRevenue = calculateYearlyRevenue(lastYear);
                statistics.setYearlyRevenue(thisYearRevenue);
                statistics.setYearlyRevenueChangePercentage(
                                calculatePercentageChange(thisYearRevenue, lastYearRevenue));

                // Tính top 5 sản phẩm bán chạy nhất trong khoảng thời gian
                List<OrderItem> orderItems = orderRepository.findByOrderTimeBetweenAndIsPaidTrue(startDate, endDate)
                                .stream().flatMap(order -> order.getOrderItems().stream()).collect(Collectors.toList());

                Map<Product, Long> productSales = orderItems.stream()
                                .collect(Collectors.groupingBy(OrderItem::getProduct,
                                                Collectors.summingLong(OrderItem::getQuantity)));

                // Lấy top 5 sản phẩm bán chạy nhất
                List<BestSellingProductDTO> bestSellingProducts = productSales.entrySet().stream()
                                .sorted(Map.Entry.<Product, Long>comparingByValue().reversed())
                                .limit(5)
                                .map(entry -> new BestSellingProductDTO(entry.getKey().getName(), entry.getValue()))
                                .collect(Collectors.toList());

                statistics.setBestSellingProducts(bestSellingProducts);

                return statistics;
        }

        // Hàm tính doanh thu theo từng ngày trong khoảng thời gian startDate - endDate
        private Map<LocalDate, Double> calculateDailyRevenue(LocalDate startDate, LocalDate endDate) {
                // Tạo danh sách các ngày từ startDate đến endDate
                List<LocalDate> datesInRange = startDate.datesUntil(endDate.plusDays(1)).collect(Collectors.toList());

                // Tạo map để lưu doanh thu của từng ngày
                Map<LocalDate, Double> dailyRevenueMap = new HashMap<>();

                // Lấy danh sách tất cả các đơn hàng đã thanh toán trong khoảng thời gian
                List<Order> orders = orderRepository.findByOrderTimeBetweenAndIsPaidTrue(
                                startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

                // Tính doanh thu theo từng ngày
                for (LocalDate date : datesInRange) {
                        LocalDateTime dayStart = date.atStartOfDay();
                        LocalDateTime dayEnd = date.atTime(23, 59, 59);

                        // Tính tổng doanh thu cho ngày hiện tại
                        double dailyRevenue = orders.stream()
                                        .filter(order -> !order.getOrderTime().isBefore(dayStart)
                                                        && !order.getOrderTime().isAfter(dayEnd))
                                        .mapToDouble(order -> order.getTotalAmount())
                                        .sum();

                        // Đưa doanh thu vào map
                        dailyRevenueMap.put(date, dailyRevenue);
                }

                return dailyRevenueMap;
        }

        private double calculateMonthlyRevenue(YearMonth yearMonth) {
                LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
                LocalDateTime endOfMonth = yearMonth.atEndOfMonth().atTime(23, 59, 59);
                return orderRepository.findByOrderTimeBetweenAndIsPaidTrue(startOfMonth, endOfMonth).stream()
                                .mapToDouble(order -> order.getTotalAmount()).sum();
        }

        private double calculateYearlyRevenue(int year) {
                LocalDateTime startOfYear = LocalDate.of(year, 1, 1).atStartOfDay();
                LocalDateTime endOfYear = LocalDate.of(year, 12, 31).atTime(23, 59, 59);
                return orderRepository.findByOrderTimeBetweenAndIsPaidTrue(startOfYear, endOfYear).stream()
                                .mapToDouble(order -> order.getTotalAmount()).sum();
        }

        private double calculatePercentageChange(double current, double previous) {
                if (previous == 0) {
                        return current > 0 ? 100 : 0;
                }
                return ((current - previous) / previous) * 100;
        }
}
