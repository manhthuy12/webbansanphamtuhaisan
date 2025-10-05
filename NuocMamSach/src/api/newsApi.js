import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getNews = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/news`, { params });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu tin tức:', error);
    throw error;
  }
};

export const getNewsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu tin tức:', error);
    throw error;
  }
};
