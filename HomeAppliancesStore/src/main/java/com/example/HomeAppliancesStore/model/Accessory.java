package com.example.HomeAppliancesStore.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Accessory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên phụ kiện không được để trống")
    @Size(max = 100, message = "Tên phụ kiện không được vượt quá 100 ký tự")
    private String name;

    @Min(value = 0, message = "Giá phụ kiện không được nhỏ hơn 0")
    private double price;

    private String image;

    @Min(value = 0, message = "Số lượng không được nhỏ hơn 0")
    private int quantity;

    private boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties("accessories")
    private Product product;

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
