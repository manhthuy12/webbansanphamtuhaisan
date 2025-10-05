package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.AddressBook;
import com.example.HomeAppliancesStore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressBookRepository extends JpaRepository<AddressBook, Long> {
 List<AddressBook> findByUserAndIsDeleteFalse(User user);
 AddressBook findByUserAndIsDefaultTrueAndIsDeleteFalse(User user);
}

