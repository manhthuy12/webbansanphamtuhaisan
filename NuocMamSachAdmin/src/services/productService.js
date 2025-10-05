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

// Hàm lấy danh sách sản phẩm (GET)
export const getAllProducts = async (name = '', categoryId = '', page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get(`/products`, {
      params: {
        name: name || '', // Nếu name tồn tại, sử dụng, nếu không để chuỗi rỗng
        categoryId: categoryId || '', // Nếu categoryId tồn tại, sử dụng
        page: page || 0, // Mặc định là trang 0 nếu không cung cấp
        size: size || 10 // Mặc định là 10 mục trên trang nếu không cung cấp
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    throw error;
  }
};
export const getAllAccessories = async (page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/accessories', {
      params: {
        page: page || 0, // Mặc định trang 0
        size: size || 0 // Mặc định 10 item mỗi trang
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phụ kiện:', error);
    throw error;
  }
};
// Hàm tạo mới sản phẩm (POST)
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(`/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới sản phẩm:', error);
    throw error;
  }
};

// Hàm cập nhật sản phẩm (PUT)
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật sản phẩm với id ${id}:`, error);
    throw error;
  }
};

// Hàm xóa sản phẩm (DELETE)
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa sản phẩm với id ${id}:`, error);
    throw error;
  }
};
