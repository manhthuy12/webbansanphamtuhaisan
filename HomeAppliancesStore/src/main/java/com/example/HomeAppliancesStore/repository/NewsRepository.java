package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT c FROM News c WHERE (:title IS NULL OR c.title LIKE %:title%) AND c.deleted = false")
    Page<News> searchNews(@Param("title") String title, Pageable pageable);
}
