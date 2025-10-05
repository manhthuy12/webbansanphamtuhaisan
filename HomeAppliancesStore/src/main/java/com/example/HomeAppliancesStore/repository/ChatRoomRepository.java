package com.example.HomeAppliancesStore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.HomeAppliancesStore.model.ChatRoom;
import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByCustomerId(Long customerId);

    List<ChatRoom> findByParticipants_Id(Long userId);

    Optional<ChatRoom> findChatRoomByCustomerId(Long customerId);
}
