package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    // Phương thức tìm kiếm voucher theo mã khuyến mãi
    Page<Voucher> findByCodeContaining(String code, Pageable pageable);
    Optional<Voucher> findByCode(String code);
    Optional<Voucher> findByCodeAndIsActive(String code, boolean isActive);
}
