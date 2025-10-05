import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../Partials/Layout";
import { getOrderByOrderId, sendEmailConffirm } from "../../api/orderApi";
import { message } from "antd";
import { formatCurrency } from "../../utils/formatCurrency";
import CheckoutImg from "../../../public/assets/images/shopping-cart.png";
import BagImg from "../../../public/assets/images/online-shopping.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CheckoutSuccess() {
  const query = useQuery();
  const orderId = query.get("orderId");
  const [order, setOrder] = useState(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const orderData = await getOrderByOrderId(orderId);
      const firstOrder = orderData.content[0];
      setOrder(firstOrder);
    } catch (error) {
      message.error("Lỗi khi lấy thông tin đơn hàng.");
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (isInitialRender.current && orderId) {
      isInitialRender.current = false;
      sendEmailConffirm(orderId);
      fetchOrderDetails();
    }
  }, [orderId]);

  // Tính tổng tiền trước khi áp dụng giảm giá
  const subTotal = order?.orderItems.reduce((acc, item) => {
    return acc + item.priceAtPurchase * item.quantity;
  }, 0);

  // Tính số tiền giảm giá nếu có voucher
  const discount = order?.voucher?.discountValue
    ? order.voucher.discountValue <= 100
      ? (subTotal * order.voucher.discountValue) / 100 // Giảm theo %
      : order.voucher.discountValue // Giảm theo số tiền
    : 0;

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="checkout-success-wrapper max-w-5xl mx-auto py-12">
        {/* Phần bên trái */}
        <div className="flex justify-between">
          <div className="w-[60%] pr-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">
                Xác nhận đơn hàng - #ORD{order?.id}
              </h1>
              {order && (
                <div className="flex items-center space-x-4 mt-3">
                  <img
                    src={CheckoutImg}
                    alt="Order Confirmation"
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <h2 className="mt-2 text-2xl font-semibold text-green-500">
                      Cảm ơn bạn, {order?.addressBook.fullName}!
                    </h2>
                    <p className="text-sm text-gray-600">
                      Bạn sẽ nhận được thông tin về hóa đơn của đơn hàng qua email.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Phần bản đồ */}
            <div className="mb-8">
              <img
                src={
                  "https://nuocmamongky.vn/upload/galleries//nuoc-mam-ong-ky-la-nuoc-mam-cot-nguyen-chat-chay-ra-dau-tien-khong-pha-tron-voi-nuoc-rut-ra-lan-2-lan-3-QOMX1684288804.jpg"
                }
                alt="Bản đồ"
                className="w-full h-64 object-cover rounded-md"
              />
            </div>

            {/* Thông tin liên hệ */}
            {order && (
              <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>
                  <p className="text-gray-600">
                    Người nhận: {order?.addressBook.recipientName}
                  </p>
                  <p className="text-gray-600">
                    Số điện thoại: {order?.addressBook.phoneNumber}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Địa chỉ</h3>
                  <p className="text-gray-600">
                    {order?.addressBook.address}, {order?.addressBook.ward},{" "}
                    {order?.addressBook.district}, {order?.addressBook.city}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Hình thức thanh toán
                  </h3>
                  <p className="text-gray-600">{order?.paymentMethod}</p>
                </div>
              </div>
            )}
          </div>

          {/* Phần bên phải - Tóm tắt đơn hàng */}
          {order && (
            <div className="w-[40%] bg-white border border-gray-200 p-4 rounded-md shadow-sm">
              <div className="flex items-center space-x-2">
                <img src={BagImg} alt="Shopping Cart Icon" className="h-6 w-6 object-cover" />
                <h3 className="text-xl font-semibold">Đơn hàng của bạn</h3>
                <div className="flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-black rounded-full">
                  {order.orderItems.length}
                </div>
              </div>

              {order.orderItems.map((item, index) => (
                <div className="flex justify-between items-center mb-4 mt-5" key={index}>
                  <div className="flex items-center space-x-4">
                    {item.product.images && item.product.images.length > 0 && (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium text-sm line-clamp-2 overflow-hidden text-ellipsis">{item.product.name}</p>
                      {item.variant && (
                        <p className="text-gray-600 text-sm">Lựa chọn: {item.variant.name}</p>
                      )}
                      <p className="text-gray-600 text-sm">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(item.priceAtPurchase)}</p>
                </div>
              ))}

              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600">Tạm tính</p>
                <p className="font-medium">{formatCurrency(subTotal)}</p>
              </div>
              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600">Giảm giá</p>
                <p className="font-medium">{discount ? `- ${formatCurrency(discount)}` : "Không có"}</p>
              </div>
              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-xl">Tổng cộng</p>
                <p className="font-semibold text-xl">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div className="mt-12 text-center">
                <div className="flex justify-center space-x-4">
                  <Link to="/all-products" className="px-6 py-3 bg-black text-white rounded-md shadow hover:bg-gray-800">
                    Tiếp tục mua sắm
                  </Link>
                  <Link to="/profile#order" className="px-6 py-3 bg-gray-700 text-white rounded-md shadow hover:bg-gray-800">
                    Lịch sử đặt hàng
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
