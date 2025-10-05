package com.example.HomeAppliancesStore.service;

import com.example.HomeAppliancesStore.model.AddressBook;
import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.repository.AddressBookRepository;
import com.example.HomeAppliancesStore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressBookService {

    @Autowired
    private AddressBookRepository addressBookRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy AddressBook theo userId
    public List<AddressBook> getAddressBooksByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return addressBookRepository.findByUserAndIsDeleteFalse(user);
    }

    // Tạo AddressBook mới
    public AddressBook createAddressBook(Long userId, AddressBook addressBook) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
            AddressBook defaultAddress = addressBookRepository.findByUserAndIsDefaultTrueAndIsDeleteFalse(user);
            if (defaultAddress == null) {
            addressBook.setDefault(true);
        } else {
            addressBook.setDefault(false);  
        }
        addressBook.setUser(user);
        return addressBookRepository.save(addressBook);
    }
    

    // Cập nhật AddressBook
    public AddressBook updateAddressBook(Long addressBookId, AddressBook addressBookDetails) {
        AddressBook addressBook = addressBookRepository.findById(addressBookId)
                .orElseThrow(() -> new IllegalArgumentException("AddressBook not found"));

        if (!addressBook.isDelete()) {
            addressBook.setRecipientName(addressBookDetails.getRecipientName());
            addressBook.setPhoneNumber(addressBookDetails.getPhoneNumber());
            addressBook.setAddress(addressBookDetails.getAddress());
            addressBook.setWard(addressBookDetails.getWard());
            addressBook.setDistrict(addressBookDetails.getDistrict());
            addressBook.setCity(addressBookDetails.getCity());
            return addressBookRepository.save(addressBook);
        } else {
            throw new IllegalArgumentException("Cannot update deleted address");
        }
    }

    // Xóa AddressBook (xóa ẩn)
    public boolean deleteAddressBook(Long addressBookId) {
        Optional<AddressBook> optionalAddressBook = addressBookRepository.findById(addressBookId);
        if (optionalAddressBook.isPresent()) {
            AddressBook addressBook = optionalAddressBook.get();
            addressBook.setDelete(true); 
            addressBookRepository.save(addressBook);
            return true;
        }
        return false;
    }

    // Thay đổi địa chỉ mặc định
    public void changeDefaultAddress(Long userId, Long addressBookId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        AddressBook newDefaultAddress = addressBookRepository.findById(addressBookId)
                .orElseThrow(() -> new IllegalArgumentException("AddressBook not found"));

        AddressBook currentDefault = addressBookRepository.findByUserAndIsDefaultTrueAndIsDeleteFalse(user);
        if (currentDefault != null && !currentDefault.getAddressBookId().equals(addressBookId)) {
            currentDefault.setDefault(false);
            addressBookRepository.save(currentDefault);
        }

        newDefaultAddress.setDefault(true);
        addressBookRepository.save(newDefaultAddress);
    }
}
