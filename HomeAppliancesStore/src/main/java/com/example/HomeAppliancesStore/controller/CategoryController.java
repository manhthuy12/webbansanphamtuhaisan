package com.example.HomeAppliancesStore.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.HomeAppliancesStore.model.Category;
import com.example.HomeAppliancesStore.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Tìm kiếm danh mục theo tên với phân trang
    @GetMapping
    public ResponseEntity<?> searchCategories(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<Category> categories = categoryService.searchCategories(name, page, size);
            return ResponseEntity.ok(categories);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tìm kiếm danh mục: " + e.getMessage());
        }
    }

    // Lấy danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id") Long id) {
        try {
            Optional<Category> categoryOptional = categoryService.getCategoryById(id);
            if (categoryOptional.isPresent()) {
                return ResponseEntity.ok(categoryOptional.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Danh mục không tồn tại");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh mục: " + e.getMessage());
        }
    }

    // Tạo mới danh mục
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody Category category, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Category createdCategory = categoryService.createCategory(category);
            return ResponseEntity.ok(createdCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo danh mục: " + e.getMessage());
        }
    }

    // Cập nhật danh mục theo ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Long id,
            @Valid @RequestBody Category categoryDetails,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            Category updatedCategory = categoryService.updateCategory(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật danh mục: " + e.getMessage());
        }
    }

    // Xóa danh mục theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok("Danh mục đã được xóa thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa danh mục: " + e.getMessage());
        }
    }
}
