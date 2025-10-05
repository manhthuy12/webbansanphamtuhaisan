package com.example.HomeAppliancesStore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.HomeAppliancesStore.model.User;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.profile.email = :email")
    Optional<User> findByProfileEmail(@Param("email") String email);

    Optional<User> findByResetToken(String token);

    Page<User> findByUsernameContaining(String username, Pageable pageable);

    // Tìm user theo danh sách role (ví dụ: ADMIN, STAFF)
    List<User> findByRoleIn(List<String> roles);
}
