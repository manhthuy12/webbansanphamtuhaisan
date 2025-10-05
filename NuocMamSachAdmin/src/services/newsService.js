import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Cấu hình axios với token
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}` // Gửi token dưới dạng Bearer
  }
});

// Hàm lấy danh sách tin tức (GET)
export const getAllNews = async (title = '', page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get(`/news`, {
      params: {
        title: title || '', // Nếu title tồn tại, sử dụng, nếu không để chuỗi rỗng
        page: page || 0, // Mặc định là trang 0 nếu không cung cấp
        size: size || 10 // Mặc định là 10 mục trên trang nếu không cung cấp
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin tức:', error);
    throw error;
  }
};

// Hàm tạo mới tin tức (POST)
export const createNews = async (newsData) => {
  try {
    const response = await axiosInstance.post(`/news`, newsData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới tin tức:', error);
    throw error;
  }
};

// Hàm cập nhật tin tức (PUT)
export const updateNews = async (id, newsData) => {
  try {
    const response = await axiosInstance.put(`/news/${id}`, newsData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật tin tức với id ${id}:`, error);
    throw error;
  }
};

// Hàm xóa tin tức (DELETE)
export const deleteNews = async (id) => {
  try {
    const response = await axiosInstance.delete(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa tin tức với id ${id}:`, error);
    throw error;
  }
};
