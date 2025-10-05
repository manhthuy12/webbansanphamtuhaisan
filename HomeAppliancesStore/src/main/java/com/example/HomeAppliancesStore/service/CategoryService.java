package com.example.HomeAppliancesStore.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.HomeAppliancesStore.model.Category;
import com.example.HomeAppliancesStore.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    // Tìm kiếm danh mục theo tên với phân trang
    public Page<Category> searchCategories(String name, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        return categoryRepository.searchCategories(name, pageRequest);
    }

    // Lấy danh mục theo ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id).filter(c -> !c.isDeleted());
    }    

    // Tạo mới danh mục
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Cập nhật danh mục theo ID
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id).filter(c -> !c.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh danh mục"));
        category.setName(categoryDetails.getName());
        category.setImage(categoryDetails.getImage());
        category.setDescription(categoryDetails.getDescription());
        return categoryRepository.save(category);
    }

    // Xóa ẩn danh mục
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).filter(c -> !c.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        category.setDeleted(true);
        categoryRepository.save(category);
    }
}
