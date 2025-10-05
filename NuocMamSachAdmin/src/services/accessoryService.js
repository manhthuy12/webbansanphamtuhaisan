import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm để lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

export const getAllAccessories = async (name, page, size) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/accessories`, {
      params: {
        name: name || '', // Nếu name không tồn tại, để chuỗi rỗng
        page: page || 0, // Mặc định là trang 0
        size: size || 10 // Mặc định 10 mục trên trang
      },
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phụ kiện:', error);
    throw error;
  }
};

export const createAccessory = async (accessoryData) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/accessories`, accessoryData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới phụ kiện:', error);
    throw error;
  }
};

export const updateAccessory = async (id, accessoryData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/accessories/${id}`, accessoryData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật phụ kiện với id ${id}:`, error);
    throw error;
  }
};

export const deleteAccessory = async (id) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API_URL}/accessories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa phụ kiện với id ${id}:`, error);
    throw error;
  }
};
