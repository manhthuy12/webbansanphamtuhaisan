package com.example.HomeAppliancesStore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HomeAppliancesStore.model.ChatRoom;
import com.example.HomeAppliancesStore.model.User;
import com.example.HomeAppliancesStore.repository.ChatRoomRepository;
import com.example.HomeAppliancesStore.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<ChatRoom> findByCustomerId(Long customerId) {
        return chatRoomRepository.findChatRoomByCustomerId(customerId);
    }

    public ChatRoom findById(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Phòng chat không tồn tại"));
    }

    // Tạo phòng chat giữa admin, staff và khách hàng
    public ChatRoom createChatRoom(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        // Tìm tất cả user có role là ADMIN hoặc STAFF
        List<User> adminsAndStaff = userRepository.findByRoleIn(List.of("ADMIN", "STAFF"));

        // Thêm customer vào participants cùng với admin và staff
        List<User> participants = new ArrayList<>(adminsAndStaff);
        participants.add(customer);

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setCustomer(customer);
        chatRoom.setParticipants(participants); 

        return chatRoomRepository.save(chatRoom);
    }

    // Lấy danh sách phòng chat của khách hàng
    public List<ChatRoom> getChatRoomsForCustomer(Long customerId) {
        return chatRoomRepository.findByCustomerId(customerId);
    }

    public List<ChatRoom> getChatRoomsForAdminAndStaff(Long userId) {
        return chatRoomRepository.findByParticipants_Id(userId);
    }
}
