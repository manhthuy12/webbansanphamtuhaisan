package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.model.Voucher;
import com.example.HomeAppliancesStore.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.time.LocalDate;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    // Tìm kiếm voucher với phân trang
    public Page<Voucher> searchVouchers(String code, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        return (code != null && !code.isEmpty())
                ? voucherRepository.findByCodeContaining(code, pageRequest)
                : voucherRepository.findAll(pageRequest);
    }

    // Lấy voucher theo ID
    public Optional<Voucher> getVoucherById(Long id) {
        return voucherRepository.findById(id);
    }

    // Lấy voucher theo code phải còn sử dụng được
    public Optional<Voucher> getVoucherByCode(String code) {
        return voucherRepository.findByCodeAndIsActive(code, true)
                .filter(voucher -> !voucher.getEndDate().isBefore(LocalDate.now()));
    }

    // Tạo mới voucher
    public Voucher createVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    // Cập nhật voucher
    public Voucher updateVoucher(Long id, Voucher voucherDetails) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
        voucher.setCode(voucherDetails.getCode());
        voucher.setDiscountValue(voucherDetails.getDiscountValue());
        voucher.setStartDate(voucherDetails.getStartDate());
        voucher.setEndDate(voucherDetails.getEndDate());
        voucher.setActive(voucherDetails.isActive());
        return voucherRepository.save(voucher);
    }

    // Xóa voucher
    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }
}
