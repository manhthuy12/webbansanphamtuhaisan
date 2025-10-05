package com.example.HomeAppliancesStore.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.example.HomeAppliancesStore.model.Product;
import com.example.HomeAppliancesStore.service.OrderService;
import com.example.HomeAppliancesStore.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    // Tìm kiếm sản phẩm theo các tiêu chí với phân trang
    @GetMapping
    public ResponseEntity<?> searchProducts(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "categoryId", required = false) String categoryIds,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            @RequestParam(name = "hot", required = false) Boolean hot,
            @RequestParam(name = "sale", required = false) Boolean sale,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            List<Long> categoryIdList = null;
            if (categoryIds != null && !categoryIds.isEmpty()) {
                categoryIdList = Arrays.stream(categoryIds.split(","))
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
            }

            Page<Product> products = productService.searchProducts(name, categoryIdList, minPrice, maxPrice, hot, sale,
                    page, size);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tìm kiếm sản phẩm: " + e.getMessage());
        }
    }

    @GetMapping("/suggestions/{userId}")
    public ResponseEntity<List<Product>> getSuggestedProducts(@PathVariable("userId") Long userId) {
        // Lấy danh sách sản phẩm đã mua từ lịch sử mua hàng
        List<Product> purchasedProducts = orderService.getPurchasedProducts(userId);

        if (purchasedProducts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Lấy danh sách sản phẩm gợi ý dựa trên lịch sử mua hàng
        List<Product> suggestedProducts = productService.getSuggestedProductsFromHistory(purchasedProducts);

        return ResponseEntity.ok(suggestedProducts);
    }

    // Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Sản phẩm không tồn tại: " + e.getMessage());
        }
    }

    // Thêm mới sản phẩm theo ID
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product, BindingResult bindingResult) {
        // Kiểm tra lỗi validate của Product
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(createdProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo sản phẩm: " + e.getMessage());
        }
    }

    // Cập nhật sản phẩm theo ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") Long id,
            @Valid @RequestBody Product productDetails,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    // Xóa sản phẩm theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Sản phẩm đã được xóa thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa sản phẩm: " + e.getMessage());
        }
    }
}
