import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm để lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Hàm lấy danh sách tất cả danh mục (GET)
export const getAllCategories = async (name, page, size) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      params: {
        name: name || '', // Nếu name tồn tại, sử dụng, nếu không để chuỗi rỗng
        page: page || 0, // Mặc định là trang 1 nếu không cung cấp
        size: size || ''
      },
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    throw error;
  }
};

// Hàm tạo mới danh mục (POST)
export const createCategory = async (categoryData) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới danh mục:', error);
    throw error;
  }
};

// Hàm cập nhật danh mục (PUT)
export const updateCategory = async (id, categoryData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật danh mục với id ${id}:`, error);
    throw error;
  }
};

// Hàm xóa danh mục (DELETE)
export const deleteCategory = async (id) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa danh mục với id ${id}:`, error);
    throw error;
  }
};
