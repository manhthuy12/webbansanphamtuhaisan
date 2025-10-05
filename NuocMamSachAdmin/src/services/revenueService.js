import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy thống kê doanh thu (GET)
export const getRevenueStatistics = async (startDate, endDate) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  try {
    const response = await axios.get(`${API_URL}/statistics`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      },
      params: {
        startDate: startDate, // Ngày bắt đầu
        endDate: endDate // Ngày kết thúc
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê doanh thu:', error);
    throw error;
  }
};
