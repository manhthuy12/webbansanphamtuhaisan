import React from "react";
import { formatCurrency } from "../../../../utils/formatCurrency";
import MapImg from "../../../../../public/assets/images/map.png";
import MapBox from "./MapBox"; // Nhập MapBox component

export default function OrderDetail({ order }) {
  const address = `${order?.addressBook.address}, ${order?.addressBook.ward}, ${order?.addressBook.district}, ${order?.addressBook.city}, Việt Nam`;

  // Tính tổng tạm tính
  const subTotal = order.orderItems.reduce(
    (acc, item) => acc + item.priceAtPurchase * item.quantity,
    0
  );

  // Tính giảm giá nếu có voucher
  const discount = order?.voucher?.discountValue
    ? order.voucher.discountValue <= 100
      ? (subTotal * order.voucher.discountValue) / 100 // Giảm theo %
      : order.voucher.discountValue // Giảm theo số tiền
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full flex space-x-6">
      {/* Left section: Order Item and Summary */}
      <div className="w-2/3 space-y-6">
        {/* Order ID and status */}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Đơn hàng: #ORD{order.id}</h2>
            <div className="flex space-x-4">
              <span className="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full">
                {order.status}
              </span>
              <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full">
                {order.paid ? "Đã thanh toán" : "Chưa thanh toán"}
              </span>
            </div>
          </div>

          <p className="text-gray-500">
            Ngày đặt:{" "}
            {new Date(order.orderTime).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Order Items */}
        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
          {order.orderItems.map((item) => (
            <div className="mb-6" key={item.id}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-4">
                  {item.product.images && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-lg font-medium">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-gray-500">Lựa chọn: {item.variant.name}</p>
                    )}
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div>
                  <p>
                    {item.quantity} x {formatCurrency(item.priceAtPurchase)}
                  </p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(item.priceAtPurchase * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Tạm tính</p>
            <p>{formatCurrency(subTotal)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">Giảm giá</p>
            <p>{discount ? `- ${formatCurrency(discount)}` : "Không có"}</p>
          </div>
          <div className="flex justify-between border-t pt-2">
            <p className="font-semibold text-lg">Tổng tiền:</p>
            <p className="font-semibold text-lg">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Right section: Customer information */}
      <div className="w-1/3 border border-gray-300 rounded-lg p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Khách hàng</h3>
          <p>{order.user.profile.fullName}</p>
          <p>{order.user.profile.phoneNumber}</p>
          <p>{order.user.profile.email}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Thông tin giao hàng</h3>
          <p>{order.addressBook.recipientName}</p>
          <p>{order.addressBook.phoneNumber || "Không có số điện thoại"}</p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
          <p>{order.paymentMethod}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h3>
          <p>
            {order?.addressBook.address}, {order?.addressBook.ward},{" "}
            {order?.addressBook.district}, {order?.addressBook.city}
          </p>
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-yellow-500 hover:text-yellow-600"
          >
            <img src={MapImg} alt="Map Icon" className="w-5 h-5 mr-2" />
            Xem bản đồ
          </a>
          <div className="mt-4">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="400"
              style={{ border: "0", borderRadius: "8px" }}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
