package com.example.HomeAppliancesStore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HomeAppliancesStore.model.ChatRoom;
import com.example.HomeAppliancesStore.service.ChatRoomService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chatrooms")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    // Tạo phòng chat giữa admin, staff và khách hàng
    @PostMapping
    public ResponseEntity<ChatRoom> createChatRoom(@RequestParam("customerId") Long customerId) {
        Optional<ChatRoom> existingChatRoom = chatRoomService.findByCustomerId(customerId);
        if (existingChatRoom.isPresent()) {
            ChatRoom chatRoom = existingChatRoom.get();
            return ResponseEntity.ok(chatRoom);
        }
        ChatRoom chatRoom = chatRoomService.createChatRoom(customerId);
        return ResponseEntity.ok(chatRoom);
    }

    // Lấy danh sách phòng chat của khách hàng
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ChatRoom>> getChatRoomsForCustomer(@PathVariable("customerId") Long customerId) {
        List<ChatRoom> chatRooms = chatRoomService.getChatRoomsForCustomer(customerId);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ChatRoom>> getChatRoomsForAdminAndStaff(@RequestParam("userId") Long userId) {
        List<ChatRoom> chatRooms = chatRoomService.getChatRoomsForAdminAndStaff(userId);
        return ResponseEntity.ok(chatRooms);
    }
}
