import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const signIn = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      username,
      password,
    });
    const token = response.data.token;
    Cookies.set('token', token, { expires: 1 });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, null, {
      params: { token, newPassword },
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const GetMe = async (authToken) => {
  try {
    // const token = Cookies.get('token');
    // if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};
