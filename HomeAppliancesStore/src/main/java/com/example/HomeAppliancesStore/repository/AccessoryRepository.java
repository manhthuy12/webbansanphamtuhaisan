package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.Accessory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccessoryRepository extends JpaRepository<Accessory, Long> {
    @Query("SELECT a FROM Accessory a WHERE (:name IS NULL OR a.name LIKE %:name%) AND a.deleted = false")
    Page<Accessory> searchAccessorys(@Param("name") String name, Pageable pageable);
}
