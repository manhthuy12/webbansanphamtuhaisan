import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm đăng nhập
export const signin = async (username, password) => {
  try {
    const response = await axios.post(API_URL + '/auth/signin', {
      username,
      password
    });

    // Lưu token vào localStorage nếu cần
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('Đăng nhập thất bại:', error);
    throw error;
  }
};

// Hàm lấy profile của người dùng từ API /auth/me
export const getProfile = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token không tồn tại');
    }

    // Gọi API với token trong header
    const response = await axios.get(API_URL + '/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Không thể lấy thông tin người dùng:', error);
    throw error;
  }
};
