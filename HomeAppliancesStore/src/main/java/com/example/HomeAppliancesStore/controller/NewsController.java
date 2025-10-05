package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.News;
import com.example.HomeAppliancesStore.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    // Tìm kiếm tin tức với phân trang
    @GetMapping
    public ResponseEntity<?> searchNews(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = Integer.MAX_VALUE + "") int size) {
        try {
            Page<News> news = newsService.searchNews(title, page, size);
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tìm kiếm tin tức: " + e.getMessage());
        }
    }

    // Lấy tin tức theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable("id") Long id) {
        try {
            Optional<News> newsOptional = newsService.getNewsById(id);
            if (newsOptional.isPresent()) {
                return ResponseEntity.ok(newsOptional.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tin tức không tồn tại");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy tin tức: " + e.getMessage());
        }
    }

    // Tạo mới tin tức
    @PostMapping
    public ResponseEntity<?> createNews(@Valid @RequestBody News news, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            News createdNews = newsService.createNews(news);
            return ResponseEntity.ok(createdNews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo tin tức: " + e.getMessage());
        }
    }

    // Cập nhật tin tức
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNews(@PathVariable("id") Long id, @Valid @RequestBody News newsDetails,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = new ArrayList<>();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorMessages.add(error.getField() + ": " + error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorMessages);
        }

        try {
            News updatedNews = newsService.updateNews(id, newsDetails);
            return ResponseEntity.ok(updatedNews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật tin tức: " + e.getMessage());
        }
    }

    // Xóa tin tức
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNews(@PathVariable("id") Long id) {
        try {
            newsService.deleteNews(id);
            return ResponseEntity.ok("Tin tức đã được xóa thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa tin tức: " + e.getMessage());
        }
    }
}
