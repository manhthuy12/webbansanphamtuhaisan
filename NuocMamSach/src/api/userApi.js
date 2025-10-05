import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("No token found");
  }
  return token;
};

export const changePassword = async (userId, data) => {
  const token = getToken();
  try {
    const response = await axios.post(`${API_URL}/auth/change-password/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw new Error('Token expired or invalid'); 
    }
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};


export const hasUserPurchasedProduct = (user, productId) => {
  if (!user || !user.orders) return false;
  for (const order of user.orders) {
    for (const orderItem of order.orderItems) {
      if (orderItem.product.id === productId) {
        return true;
      }
    }
  }
  return false;
};
