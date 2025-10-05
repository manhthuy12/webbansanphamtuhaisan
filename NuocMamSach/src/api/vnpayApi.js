import axios from "axios";

// Retrieve Backend URL from .env file
const API_URL = import.meta.env.VITE_API_URL;

// Function to get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Function to create VNPay payment
export const createVNPayPayment = async (amount, orderInfo, returnUrl) => {
  try {
    const response = await axios.get(`${API_URL}/vnpay/payment`, {
      params: {
        amount,
        orderInfo,
        returnUrl,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Add token to header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating VNPay payment", error);
    throw error;
  }
};

// Function to handle VNPay payment return
export const handleVNPayPaymentReturn = async (requestParams) => {
  try {
    const response = await axios.get(`${API_URL}/vnpay/paymentReturn`, {
      params: requestParams,
      headers: {
        Authorization: `Bearer ${getToken()}`, // Add token to header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error handling VNPay payment return", error);
    throw error;
  }
};
