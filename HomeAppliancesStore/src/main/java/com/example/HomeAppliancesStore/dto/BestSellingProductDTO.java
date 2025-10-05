package com.example.HomeAppliancesStore.dto;

public class BestSellingProductDTO {
    private String productName;
    private long quantitySold;

    // Constructor
    public BestSellingProductDTO(String productName, long quantitySold) {
        this.productName = productName;
        this.quantitySold = quantitySold;
    }

    // Getters và Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public long getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(long quantitySold) {
        this.quantitySold = quantitySold;
    }
}
