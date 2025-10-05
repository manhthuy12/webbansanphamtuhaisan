import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) {
    throw new Error("No token found");
  }
  return token;
};

// Hàm tạo đơn hàng với các dữ liệu người dùng truyền vào
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
      `${API_URL}/orders?userId=${userId}&addressId=${addressId}&voucherCode=${
        voucherCode || ""
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

export const getOrderByOrderId = async (orderId, page = 0, size = 10) => {
  const token = getToken(); // Lấy token để xác thực

  try {
    const response = await axios.get(
      `${API_URL}/orders?orderId=${orderId}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Xử lý khi API gọi thành công
    console.log("Order fetched successfully:", response.data.content);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        console.error("Token expired or invalid");
        throw new Error("Token expired or invalid");
      }
    }
    console.error("Error fetching order:", error);
    throw error;
  }
};
export const getOrderByUserId = async (userId, page = 0, size = 10) => {
  const token = getToken(); // Lấy token để xác thực

  try {
    const response = await axios.get(
      `${API_URL}/orders?userId=${userId}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Xử lý khi API gọi thành công
    console.log("Order fetched successfully:", response.data.content);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        console.error("Token expired or invalid");
        throw new Error("Token expired or invalid");
      }
    }
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const sendEmailConffirm = async (orderId) => {
  const token = getToken(); // Lấy token để xác thực
  console.log(token);
  try {
    const response = await axios.post(
      `${API_URL}/orders/sendOrderConfirmation?orderId=${orderId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Xử lý khi API gọi thành công
    console.log("send email successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error end email:", error);
    throw error;
  }
};
export const updateOrderStatus = async (orderId, status) => {
  const token = getToken();
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, null, {
      params: {
        status
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái đơn hàng với id ${orderId}:`, error);
    throw error;
  }
};