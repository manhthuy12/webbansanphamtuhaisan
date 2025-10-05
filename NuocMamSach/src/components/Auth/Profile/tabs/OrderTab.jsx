import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderByUserId, updateOrderStatus } from "../../../../api/orderApi";
import { message, Modal, Popconfirm, Button } from "antd";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { AiOutlineEye, AiOutlineCloseCircle } from "react-icons/ai";
import OrderDetail from "./OrderDetail";

export default function OrderTab() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);

  const fetchOrders = async () => {
    try {
      const userId = userInfo.id;
      const orderData = await getOrderByUserId(userId);
      setOrders(orderData.content);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách đơn hàng.");
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchOrders();
    }
  }, [userInfo]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "Đã hủy");
      message.success("Đơn hàng đã được hủy thành công.");
      fetchOrders(); // Refresh danh sách đơn hàng sau khi hủy
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng.");
    }
  };

  return (
    <>
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-[#FFBB38] text-black">
            <tr>
              <th className="py-3 px-6 text-center">Khách hàng</th>
              <th className="py-3 px-6 text-center">Liên hệ</th>
              <th className="py-3 px-6 text-center">Ngày đặt</th>
              <th className="py-3 px-6 text-center">Trạng thái</th>
              <th className="py-3 px-6 text-center">Tổng tiền</th>
              <th className="py-3 px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  className="bg-white border-b transition-all duration-300"
                  key={order.id}
                >
                  <td className="text-center py-4 text-gray-700">
                    {order.addressBook?.recipientName || "N/A"}
                  </td>
                  <td className="text-center py-4 text-gray-700">
                    {order.addressBook?.phoneNumber || "N/A"} <br />
                    {order.addressBook?.email || "N/A"}
                  </td>
                  <td className="text-center py-4 text-gray-700">
                    {new Date(order.orderTime).toLocaleDateString()}
                  </td>
                  <td className="text-center py-4">
                    <span
                      className={`text-sm rounded-full px-4 py-1 font-semibold ${order.status === "Chờ xác nhận"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "Đã hủy"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center py-4 text-gray-800 font-medium">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="text-center py-4 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleViewDetails(order)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-all duration-300"
                    >
                      <AiOutlineEye className="text-xl" />
                    </button>
                    {order.status === "Chờ xác nhận" && (
                      <Popconfirm
                        title="Xác nhận hủy đơn"
                        description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                        onConfirm={() => handleCancelOrder(order.id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                      >
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-all duration-300"
                        >
                          <AiOutlineCloseCircle className="text-xl" />
                        </button>
                      </Popconfirm>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-500 text-base"
                >
                  Không có đơn hàng nào để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal OrderDetail */}
      {selectedOrder && (
        <Modal
          title="Chi tiết đơn hàng"
          visible={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={1000}
        >
          <OrderDetail order={selectedOrder} />
        </Modal>
      )}
    </>
  );
}
