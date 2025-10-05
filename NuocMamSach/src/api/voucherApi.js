import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getVoucherByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/by-code/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    throw error;
  }
};
