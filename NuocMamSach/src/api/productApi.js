import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProducts = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductSuggestions = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/suggestions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    throw error;
  }
};
