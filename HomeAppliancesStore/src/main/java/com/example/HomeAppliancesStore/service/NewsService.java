package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.model.News;
import com.example.HomeAppliancesStore.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    // Tìm kiếm tin tức với phân trang
    public Page<News> searchNews(String title, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        return newsRepository.searchNews(title, pageRequest);
    }

    // Lấy tin tức theo ID
    public Optional<News> getNewsById(Long id) {
        return newsRepository.findById(id).filter(n -> !n.isDeleted());
    }

    // Tạo mới tin tức
    public News createNews(News news) {
        return newsRepository.save(news);
    }

    // Cập nhật tin tức
    public News updateNews(Long id, News newsDetails) {
        News news = newsRepository.findById(id).filter(n -> !n.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));

        news.setTitle(newsDetails.getTitle());
        news.setContent(newsDetails.getContent());
        news.setImage(newsDetails.getImage());
        news.setPublishedDate(newsDetails.getPublishedDate());
        return newsRepository.save(news);
    }

    // Xóa ẩn tin tức
    public void deleteNews(Long id) {
        News news = newsRepository.findById(id).filter(n -> !n.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));
        news.setDeleted(true);
        newsRepository.save(news);
    }
}
