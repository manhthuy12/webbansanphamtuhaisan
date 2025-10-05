import axios from 'axios';

// Lấy URL từ biến môi trường (Vite)
const API_URL = import.meta.env.VITE_API_URL;

// Lấy token từ localStorage để gửi trong header Authorization
const getToken = () => {
  return localStorage.getItem('token');
};

// Cấu hình header với token
const config = {
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
};
export const createOrder = async (
  userId,
  totalAmount,
  paymentMethod,
  paid,
  orderItems,
  addressId, // Thêm addressId
  voucherCode // Thêm voucherCode
) => {
  const token = getToken();

  const orderData = {
    status: "Chờ xác nhận",
    totalAmount,
    paymentMethod,
    paid,
    orderTime: new Date().toISOString(),
    orderItems,
  };

  try {
    const response = await axios.post(
      `${API_URL}/orders/offline?userId=${userId}&addressId=${addressId}&voucherCode=${voucherCode || ""
      }`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        console.error("Token expired or invalid");
        throw new Error("Token expired or invalid");
      }
    }
    console.error("Error creating order:", error);
    throw error;
  }
};
// Hàm lấy danh sách đơn hàng theo các tham số (GET)
export const getAllOrders = async (userId, paymentMethod, status, paid, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      params: {
        userId,
        paymentMethod,
        status,
        paid,
        page,
        size
      },
      ...config
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    throw error;
  }
};

// Hàm cập nhật trạng thái đơn hàng (PUT)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, null, {
      params: {
        status
      },
      ...config
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái đơn hàng với id ${orderId}:`, error);
    throw error;
  }
};

// Hàm cập nhật trạng thái thanh toán của đơn hàng (PUT)
export const updateOrderPaid = async (orderId, paid) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}`, { paid }, config);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái thanh toán của đơn hàng với id ${orderId}:`, error);
    throw error;
  }
};
