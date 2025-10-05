package com.example.HomeAppliancesStore.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class StatisticDTO {
    private long totalProducts;
    private long totalOrders;
    private long totalUsers;
    private double totalRevenue;

    private double todayRevenue;
    private double todayRevenueChangePercentage;

    private double monthlyRevenue;
    private double monthlyRevenueChangePercentage;

    private double yearlyRevenue;
    private double yearlyRevenueChangePercentage;

    private Map<LocalDate, Double> dailyRevenue; // Thêm doanh thu theo từng ngày

    private List<BestSellingProductDTO> bestSellingProducts; 

    // Getters và Setters
    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public double getTodayRevenueChangePercentage() {
        return todayRevenueChangePercentage;
    }

    public void setTodayRevenueChangePercentage(double todayRevenueChangePercentage) {
        this.todayRevenueChangePercentage = todayRevenueChangePercentage;
    }

    public double getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(double monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public double getMonthlyRevenueChangePercentage() {
        return monthlyRevenueChangePercentage;
    }

    public void setMonthlyRevenueChangePercentage(double monthlyRevenueChangePercentage) {
        this.monthlyRevenueChangePercentage = monthlyRevenueChangePercentage;
    }

    public double getYearlyRevenue() {
        return yearlyRevenue;
    }

    public void setYearlyRevenue(double yearlyRevenue) {
        this.yearlyRevenue = yearlyRevenue;
    }

    public double getYearlyRevenueChangePercentage() {
        return yearlyRevenueChangePercentage;
    }

    public void setYearlyRevenueChangePercentage(double yearlyRevenueChangePercentage) {
        this.yearlyRevenueChangePercentage = yearlyRevenueChangePercentage;
    }

    public Map<LocalDate, Double> getDailyRevenue() {
        return dailyRevenue;
    }

    public void setDailyRevenue(Map<LocalDate, Double> dailyRevenue) {
        this.dailyRevenue = dailyRevenue;
    }

    public List<BestSellingProductDTO> getBestSellingProducts() {
        return bestSellingProducts;
    }

    public void setBestSellingProducts(List<BestSellingProductDTO> bestSellingProducts) {
        this.bestSellingProducts = bestSellingProducts;
    }
}
