import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  Paper,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Import API
import { getAllChatRoomsForAdmin } from '../../services/chatRoomService';
import MainCard from 'ui-component/cards/MainCard';
import { useSelector } from 'react-redux';

const SamplePage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null); 

  const userData = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    connectWebSocket();
    fetchChatRooms();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [userData.id]);

  const fetchChatRooms = async () => {
    try {
      const data = await getAllChatRoomsForAdmin(userData.id);
      setChatRooms(data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClientRef.current.connect(
      {},
      (frame) => {
        console.log('Connected: ' + frame);
        stompClientRef.current.subscribe(`/topic/chatroom`, (message) => {
          console.log('Received message from /topic/chatroom:', message);
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          fetchChatRooms();
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
      }
    );
  };

  const handleSelectChatRoom = (room) => {
    setSelectedChatRoom(room);
    setMessages(room.messages);
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }
    connectWebSocket();
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      content: messageContent,
      sender: { id: userData.id },
      chatRoom: {
        id: selectedChatRoom.id
      },
      timestamp: new Date().toISOString()
    };

    if (stompClientRef.current && selectedChatRoom) {
      stompClientRef.current.send(`/app/chat.sendMessage`, {}, JSON.stringify(newMessage));
    }
    setMessageContent(''); // Clear input
  };

  return (
    <MainCard title="Chat tư vấn khách hàng">
      <Box display="flex" height="80vh">
        {/* Sidebar for Conversations */}
        <Box width="25%" p={2} display="flex" flexDirection="column">
          <Typography variant="h5" gutterBottom>
            Danh sách đoạn chat
          </Typography>
          <List>
            {chatRooms.map((room) => (
              <ListItem button onClick={() => handleSelectChatRoom(room)} key={room.id}>
                <ListItemAvatar>
                  <Avatar alt={room.customer.profile.fullName} src={room.customer.profile.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={room.customer.profile.fullName}
                  secondary={room.messages.length > 0 ? room.messages[room.messages.length - 1].content : 'No messages yet'}
                  primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                  secondaryTypographyProps={{ fontSize: '0.9rem', color: 'textSecondary' }}
                />
                <Divider />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat content */}
        <Box flex={1} p={2} display="flex" flexDirection="column" bgcolor="white">
          <Box
            flex={1}
            p={3}
            borderRadius={2}
            display="flex"
            flexDirection="column"
            gap={2}
            boxShadow={3}
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            {/* Chat Header */}
            {selectedChatRoom && (
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} pb={2} borderBottom="1px solid #e0e0e0">
                <Box display="flex" alignItems="center">
                  <Avatar src={selectedChatRoom.customer.profile.avatar} alt={selectedChatRoom.customer.profile.fullName} />
                  <Box ml={2}>
                    <Typography variant="h5">{selectedChatRoom.customer.profile.fullName}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {selectedChatRoom.customer.profile.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Chat Messages */}
            <Box flex={1} overflow="auto" px={2}>
              {selectedChatRoom ? (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    display="flex"
                    justifyContent={message.sender.id === userData.id ? 'flex-end' : 'flex-start'}
                    mt={2}
                  >
                    <Box
                      bgcolor={message.sender.id === userData.id ? '#6f42c1' : '#f1f1f1'}
                      color={message.sender.id === userData.id ? 'white' : 'black'}
                      px={3}
                      py={1.5}
                      borderRadius={5}
                      maxWidth="60%"
                      boxShadow={
                        message.sender.id === userData.id ? '0px 3px 10px rgba(111, 66, 193, 0.3)' : '0px 3px 10px rgba(0, 0, 0, 0.1)'
                      }
                    >
                      <Typography variant="body1" style={{ fontSize: '1rem' }}>
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        textAlign="right"
                        color={message.sender.id === userData.id ? 'white' : 'black'}
                        mt={0.5}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                  Select a conversation to view messages.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Input Area */}
          <Paper
            component="form"
            onSubmit={handleSendMessage}
            sx={{ display: 'flex', alignItems: 'center', p: '10px', mt: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              sx={{ flex: 1, marginRight: '8px' }}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </MainCard>
  );
};

export default SamplePage;
