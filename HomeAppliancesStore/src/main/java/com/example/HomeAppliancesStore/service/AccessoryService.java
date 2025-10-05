package com.example.HomeAppliancesStore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.HomeAppliancesStore.model.Accessory;
import com.example.HomeAppliancesStore.repository.AccessoryRepository;
import org.springframework.data.domain.Sort;

import java.util.Optional;

@Service
public class AccessoryService {

    @Autowired
    private AccessoryRepository accessoryRepository;

    // Tìm kiếm phụ kiện theo tên với phân trang
    public Page<Accessory> searchAccessories(String name, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        return accessoryRepository.searchAccessorys(name, pageRequest);
    }

    // Lấy phụ kiện theo ID
    public Optional<Accessory> getAccessoryById(Long id) {
        return accessoryRepository.findById(id)
                .filter(a -> !a.isDeleted());
    }

    // Tạo mới phụ kiện
    public Accessory createAccessory(Accessory accessory) {
        return accessoryRepository.save(accessory);
    }

    // Cập nhật phụ kiện theo ID
    public Optional<Accessory> updateAccessory(Long id, Accessory accessoryDetails) {
        Accessory accessory = accessoryRepository.findById(id)
                .filter(a -> !a.isDeleted()).orElseThrow(() -> new RuntimeException("Không tìm thấy phụ kiện"));

        // Cập nhật thông tin phụ kiện
        accessory.setName(accessoryDetails.getName());
        accessory.setPrice(accessoryDetails.getPrice());
        accessory.setImage(accessoryDetails.getImage());
        accessory.setQuantity(accessoryDetails.getQuantity());

        // Nếu phụ kiện mới có liên kết với một sản phẩm
        if (accessoryDetails.getProduct() != null) {
            accessory.setProduct(accessoryDetails.getProduct());
        }

        return Optional.of(accessoryRepository.save(accessory));
    }

    // Xóa ẩn phụ kiện
    public void deleteAccessory(Long id) {
        Accessory accessory = accessoryRepository.findById(id).filter(a -> !a.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ kiện"));
        accessory.setDeleted(true);
        accessoryRepository.save(accessory);
    }
}
