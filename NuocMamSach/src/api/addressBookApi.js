import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy token từ Cookies
const getToken = () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("No token found");
  }
  return token;
};

// Hàm lấy tất cả AddressBook theo User ID
export const getAddressBooksByUserId = async (userId) => {
  const token = getToken();

  try {
    const response = await axios.get(`${API_URL}/addressbook/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error("Token expired or invalid");
    }
    console.error("Error fetching address books by user ID:", error);
    throw error;
  }
};

// Hàm tạo mới AddressBook
export const createAddressBook = async (
  userId,
  recipientName,
  phoneNumber,
  address,
  ward,
  district,
  city,
  email
) => {
  const token = getToken();

  const addressData = {
    recipientName,
    phoneNumber,
    address,
    ward,
    district,
    city,
    email,
  };

  try {
    const response = await axios.post(
      `${API_URL}/addressbook/user/${userId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.payload;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error("Token expired or invalid");
    }
    console.error("Error creating address book:", error);
    throw error;
  }
};

// Hàm cập nhật AddressBook theo ID
export const updateAddressBook = async (
  addressBookId,
  recipientName,
  phoneNumber,
  address,
  ward,
  district,
  city,
  email
) => {
  const token = getToken();

  const addressData = {
    recipientName,
    phoneNumber,
    address,
    ward,
    district,
    city,
    email,
  };

  try {
    const response = await axios.put(
      `${API_URL}/addressbook/${addressBookId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.payload;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error("Token expired or invalid");
    }
    console.error("Error updating address book:", error);
    throw error;
  }
};

// Hàm xóa AddressBook theo ID
export const deleteAddressBook = async (addressBookId) => {
  const token = getToken();

  try {
    const response = await axios.delete(
      `${API_URL}/addressbook/${addressBookId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.payload;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error("Token expired or invalid");
    }
    console.error("Error deleting address book:", error);
    throw error;
  }
};

// API URL cho Tỉnh, Quận, Phường
const PROVINCE_API_URL = "https://provinces.open-api.vn/api/p/";

// Hàm lấy danh sách các tỉnh
export const fetchProvinces = async () => {
  try {
    const response = await axios.get(PROVINCE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Hàm lấy danh sách các quận theo mã tỉnh
export const fetchDistrictsByProvince = async (provinceCode) => {
  try {
    const response = await axios.get(
      `${PROVINCE_API_URL}${provinceCode}?depth=2`
    );
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Hàm lấy danh sách các phường theo mã quận
export const fetchWardsByDistrict = async (districtCode) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};
// Hàm thay đổi địa chỉ mặc định
export const changeDefaultAddress = async (userId, addressBookId) => {
  const token = getToken();

  try {
    const response = await axios.put(
      `${API_URL}/addressbook/default/${userId}/${addressBookId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error("Token expired or invalid");
    }
    console.error("Error changing default address:", error);
    throw error;
  }
};
