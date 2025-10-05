import axios from "axios";

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("token"); 
  if (!token) {
    throw new Error("No token found");
  }
  return token;
};

// Hàm cập nhật hồ sơ (PUT)
export const updateProfile = async (id, profileData) => {
  const token = getToken(); // Sử dụng hàm getToken để lấy token

  try {
    const response = await axios.put(`${API_URL}/profiles/${id}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật hồ sơ với id ${id}:`, error);
    throw error;
  }
};
