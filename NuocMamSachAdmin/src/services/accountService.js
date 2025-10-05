import axios from 'axios';

// Lấy URL API từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Hàm gọi API lấy danh sách tài khoản (GET)
export const getAllAccounts = async (username = '', page = 0, size = 10) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/users/list`, {
      params: {
        username: username || '',
        page: page || 0,
        size: size || 10
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    throw error;
  }
};

// Hàm gọi API tạo tài khoản mới (POST)
export const createAccount = async (accountData) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/users`, accountData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản mới:', error);
    throw error;
  }
};

// Hàm gọi API khóa hoặc mở khóa tài khoản (PUT)
export const lockAccount = async (id) => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${API_URL}/users/${id}/lock`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi khóa tài khoản với id ${id}:`, error);
    throw error;
  }
};

// Hàm gọi API cập nhật tài khoản (PUT)
export const editAccount = async (id, accountData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/users/${id}/edit`, accountData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật tài khoản với id ${id}:`, error);
    throw error;
  }
};
