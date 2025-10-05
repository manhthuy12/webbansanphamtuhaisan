import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      throw new Error("No token found");
    }
    return token;
  };

// Hàm tạo phòng chat cho khách hàng với customerId
export const createChatRoom = async (customerId) => {
  if (!customerId) {
    throw new Error("CustomerId not found in localStorage");
  }

  try {
    const response = await axios.post(
      `${API_URL}/chatrooms`,
      null, // Không có body nên gửi null
      {
        params: { customerId }, // Truyền customerId qua query params
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header nếu có
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating chat room", error);
    throw error;
  }
};
