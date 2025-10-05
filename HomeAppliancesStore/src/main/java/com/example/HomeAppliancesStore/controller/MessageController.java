package com.example.HomeAppliancesStore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.HomeAppliancesStore.model.Message;
import com.example.HomeAppliancesStore.service.MessageService;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // REST API to get messages by chat room
    @GetMapping("/chatroom/{chatRoomId}")
    public ResponseEntity<List<Message>> getMessagesByChatRoom(@PathVariable("chatRoomId") Long chatRoomId) {
        List<Message> messages = messageService.getMessagesByChatRoom(chatRoomId);
        return ResponseEntity.ok(messages);
    }
}
