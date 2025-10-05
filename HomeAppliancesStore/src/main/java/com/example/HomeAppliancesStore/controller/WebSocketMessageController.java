package com.example.HomeAppliancesStore.controller;

import com.example.HomeAppliancesStore.model.Message;
import com.example.HomeAppliancesStore.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketMessageController {

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chatroom")
    public Message sendMessage(Message message) {
        return messageService.sendMessage(message.getChatRoom().getId(), message.getSender().getId(), message.getContent());
    }
}
