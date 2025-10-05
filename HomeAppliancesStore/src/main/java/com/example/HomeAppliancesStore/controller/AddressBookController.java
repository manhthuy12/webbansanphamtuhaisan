package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.AddressBook;
import com.example.HomeAppliancesStore.service.AddressBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addressbook")
public class AddressBookController {

    @Autowired
    private AddressBookService addressBookService;

    // API lấy AddressBook theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressBook>> getAddressBookByUserId(@PathVariable("userId") Long userId) {
        List<AddressBook> addressBooks = addressBookService.getAddressBooksByUserId(userId);
        return ResponseEntity.ok(addressBooks);
    }

    // API tạo mới AddressBook
    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressBook> createAddressBook(@PathVariable("userId") Long userId,
            @RequestBody AddressBook addressBook) {
        AddressBook createdAddressBook = addressBookService.createAddressBook(userId, addressBook);
        return ResponseEntity.status(201).body(createdAddressBook);
    }

    // API cập nhật AddressBook
    @PutMapping("/{addressBookId}")
    public ResponseEntity<AddressBook> updateAddressBook(@PathVariable("addressBookId") Long addressBookId,
            @RequestBody AddressBook addressBook) {
        AddressBook updatedAddressBook = addressBookService.updateAddressBook(addressBookId, addressBook);
        return ResponseEntity.ok(updatedAddressBook);
    }

    // API xóa AddressBook
    @DeleteMapping("/{addressBookId}")
    public ResponseEntity<Void> deleteAddressBook(@PathVariable("addressBookId") Long addressBookId) {
        boolean isDeleted = addressBookService.deleteAddressBook(addressBookId);
        if (isDeleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).build(); 
        }
    }

    // API để thay đổi địa chỉ mặc định
    @PutMapping("/default/{userId}/{addressBookId}")
    public ResponseEntity<Void> changeDefaultAddress(@PathVariable("userId") Long userId, @PathVariable("addressBookId") Long addressBookId) {
        addressBookService.changeDefaultAddress(userId, addressBookId);
        return ResponseEntity.ok().build();
    }
}
