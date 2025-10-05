package com.example.HomeAppliancesStore.repository;

import com.example.HomeAppliancesStore.model.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    @Query("SELECT p FROM Profile p WHERE " +
           "(:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:phoneNumber IS NULL OR LOWER(p.phoneNumber) LIKE LOWER(CONCAT('%', :phoneNumber, '%'))) AND " +
           "(:email IS NULL OR LOWER(p.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    Page<Profile> searchProfiles(@Param("name") String name,
                                 @Param("phoneNumber") String phoneNumber,
                                 @Param("email") String email,
                                 Pageable pageable);
}
