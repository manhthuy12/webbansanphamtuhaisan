import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/categories`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
