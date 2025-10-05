import React, { useEffect, useRef, useState } from "react";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const ChatBox = ({ onClose, messages, chatRoomId }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [msgList, setMsgList] = useState(messages);
  const [aiLoading, setAiLoading] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  // Kết nối WebSocket
  const connectWebSocket = () => {
    if (stompClientRef.current) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect(
      {},
      () => {
        stompClientRef.current.subscribe(`/topic/chatroom`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMsgList((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  useEffect(() => {
    connectWebSocket();
  }, []);

  // Hàm convert markdown đơn giản sang HTML (bold, italic, xuống dòng)
  function simpleMarkdownToHtml(md) {
    let html = md
      .replace(/</g, "&lt;") // escape <
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");
    return html;
  }

  // Gọi API OpenRouter lấy trả lời AI (chỉ dùng nếu không khớp điều kiện tự xử lý)
  const callOpenRouterAPI = async (message) => {
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";
    const API_KEY = "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";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        }),
      });
      const data = await response.json();

      const md =
        data.choices?.[0]?.message?.content || "AI không trả lời được.";
      return simpleMarkdownToHtml(md);
    } catch (error) {
      console.error("Lỗi khi gọi API AI:", error);
      return "Có lỗi xảy ra khi gọi AI.";
    }
  };

  // Trả lời tự động cho các intent cơ bản
  const handleCustomAIResponse = (message) => {
  let reply = null;

  if (message.toLowerCase().includes("nước mắm")) {
    reply = `
      Một số sản phẩm nước mắm nổi bật:<br/>
      - <strong>Nước mắm cá cơm 40 độ chai 500ml</strong> – <span style="color:red;">69.000đ</span> (giá gốc 80.000đ)<br/>
      - <strong>Nước mắm cá cơm 30 độ chai 500ml</strong> – <span style="color:red;">65.000đ</span> (giá gốc 70.000đ)<br/>
      - <strong>Nước mắm cá cơm 20 độ chai 500ml</strong> – <span style="color:red;">50.000đ</span> (giá gốc 60.000đ)<br/>
    `;
  }

  if (message.toLowerCase().includes("giúp")) {
    reply =
      "Bạn có thể hỏi về sản phẩm, giá, khuyến mãi, hoặc đặt hàng. Ví dụ: 'nước mắm', 'hỗ trợ đặt hàng'...";
  }

  return reply;
};

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    if (inputMessage.toLowerCase().includes("@ai")) {
      const userMsg = {
        content: inputMessage,
        sender: {
          id: user?.id,
          profile: {
            avatar: user?.profile?.avatar,
            fullName: user?.profile?.fullName,
          },
          userId: user?.id,
        },
        chatRoom: { id: chatRoomId },
        timestamp: new Date().toISOString(),
      };
      setMsgList((prev) => [...prev, userMsg]);
      setInputMessage("");
      setAiLoading(true);

      const prompt = inputMessage.replace(/@ai/gi, "").trim();

      // Kiểm tra intent custom trước
      let aiResponseHtml = handleCustomAIResponse(prompt);

      // Nếu không có custom response thì gọi OpenRouter
      if (!aiResponseHtml) {
        aiResponseHtml = await callOpenRouterAPI(prompt);
      }

      const aiMsg = {
        content: aiResponseHtml,
        sender: {
          id: "ai_bot",
          profile: {
            avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
            fullName: "AI Assistant",
          },
          userId: "ai_bot",
        },
        chatRoom: { id: chatRoomId },
        timestamp: new Date().toISOString(),
      };

      setMsgList((prev) => [...prev, aiMsg]);
      setAiLoading(false);
    } else {
      // Gửi qua websocket
      if (stompClientRef.current && stompClientRef.current.connected) {
        if (!user || !user.id) {
          console.error("User or id is missing from Redux");
          return;
        }

        const newMsgData = {
          content: inputMessage,
          sender: {
            id: user.id,
            profile: {
              avatar: user.profile.avatar,
              fullName: user.profile.fullName,
            },
            userId: user.id,
          },
          chatRoom: {
            id: chatRoomId,
          },
          timestamp: new Date().toISOString(),
        };

        stompClientRef.current.send(
          `/app/chat.sendMessage`,
          {},
          JSON.stringify(newMsgData)
        );
        setInputMessage("");
      } else {
        console.warn("WebSocket is not open. Message not sent.");
      }
    }
  };

  // Cuộn xuống cuối
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgList, aiLoading]);

  return (
    <div className="fixed bottom-5 right-5 w-[550px] h-[500px] bg-white rounded-lg shadow-lg flex flex-col z-50">
      <div className="p-3 bg-[#FFBB38] text-white flex justify-between items-center rounded-t-lg">
        <div className="flex items-center">
          <img
            src="https://i.pinimg.com/originals/48/da/d4/48dad4cf8eb8bcf206f7f8de29b8d632.gif"
            alt="User Avatar"
            className="rounded-full w-10 h-10 mr-3"
          />
          <span>Tư vấn mua hàng</span>
        </div>
        <button onClick={onClose} className="text-white">
          <CloseOutlined />
        </button>
      </div>

      <div className="px-3 text-xs text-gray-600 italic mb-1">
        * Gõ <b>@AI</b> trong tin nhắn để chat với AI
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {msgList.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.sender.id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender.id !== user?.id && (
              <img
                src={msg.sender.profile.avatar}
                alt="Avatar"
                className="rounded-full w-8 h-8 mr-2"
              />
            )}
            <div
              className={`p-3 rounded-lg max-w-[60%] break-words ${
                msg.sender.id === user?.id
                  ? "bg-[#FFF3CD] text-black"
                  : msg.sender.id === "ai_bot"
                  ? "bg-blue-200 text-black"
                  : "bg-gray-200"
              }`}
            >
              <div className="flex items-center mb-1 text-sm font-bold">
                <span className="text-gray-800">{msg.sender.profile.fullName} - </span>
                <span className="ml-1 text-gray-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              {msg.sender.id === "ai_bot" ? (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              ) : (
                <div className="text-gray-700">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="text-center italic text-gray-500 mb-2">AI đang trả lời...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 flex items-center">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Đặt câu hỏi"
          className="flex-1 mr-2 rounded-full h-10 px-4 border border-gray-300"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={aiLoading}
        />
        <button
          className="bg-[#FFBB38] text-white rounded-full p-2 w-10"
          onClick={handleSendMessage}
          disabled={aiLoading}
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
