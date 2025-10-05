import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm để lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Hàm lấy danh sách hồ sơ (GET)
export const getAllProfiles = async (name, phoneNumber, email, page = 0, size = 10) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/profiles`, {
      params: {
        name: name || '', // Nếu có name thì sử dụng, nếu không thì để chuỗi rỗng
        phoneNumber: phoneNumber || '', // Tương tự với phoneNumber
        email: email || '', // Tương tự với email
        page: page, // Số trang
        size: size // Số lượng mỗi trang
      },
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hồ sơ:', error);
    throw error;
  }
};

// Hàm tạo mới hồ sơ (POST)
export const createProfile = async (profileData) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/profiles`, profileData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới hồ sơ:', error);
    throw error;
  }
};

// Hàm cập nhật hồ sơ (PUT)
export const updateProfile = async (id, profileData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/profiles/${id}`, profileData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật hồ sơ với id ${id}:`, error);
    throw error;
  }
};

// Hàm xóa hồ sơ (DELETE)
export const deleteProfile = async (id) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API_URL}/profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa hồ sơ với id ${id}:`, error);
    throw error;
  }
};
