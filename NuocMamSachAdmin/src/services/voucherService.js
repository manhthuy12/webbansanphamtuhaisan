import axios from 'axios';

// Lấy API_URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy danh sách voucher (GET)
export const getAllVouchers = async (code = '', page = 0, size = 10) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  try {
    const response = await axios.get(`${API_URL}/vouchers`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      },
      params: {
        code: code || '', // Nếu code tồn tại, sử dụng, nếu không thì để chuỗi rỗng
        page: page,
        size: size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách voucher:', error);
    throw error;
  }
};
export const getVoucherByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/by-code/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    throw error;
  }
};
// Hàm tạo mới voucher (POST)
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  try {
    const response = await axios.post(`${API_URL}/vouchers`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo mới voucher:', error);
    throw error;
  }
};

// Hàm cập nhật voucher (PUT)
export const updateVoucher = async (id, voucherData) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  try {
    const response = await axios.put(`${API_URL}/vouchers/${id}`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật voucher với id ${id}:`, error);
    throw error;
  }
};

// Hàm xóa voucher (DELETE)
export const deleteVoucher = async (id) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  try {
    const response = await axios.delete(`${API_URL}/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Gửi token vào header
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa voucher với id ${id}:`, error);
    throw error;
  }
};
