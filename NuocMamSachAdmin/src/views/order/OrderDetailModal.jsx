import React, { useEffect, useState } from "react";
import { Modal, Steps, message, Divider, Row, Col, List, Switch } from "antd";
import { updateOrderStatus, updateOrderPaid } from "services/orderService";
import Machine from "../../assets/images/machine.png";
import { formatCurrency } from "utils/formatCurrency";
import MapImg from "../../assets/images/map.png";
import MapBox from "./MapBox";

const { Step } = Steps;

const statusSteps = [
  { label: 'Chờ xác nhận', value: 'Chờ xác nhận' },
  { label: 'Đang xử lý', value: 'Đang xử lý' },
  { label: 'Đang vận chuyển', value: 'Đang vận chuyển' },
  { label: 'Đã giao hàng', value: 'Đã giao hàng' },
  { label: 'Hoàn tất', value: 'Hoàn tất' },
  { label: 'Đã hủy', value: 'Đã hủy' }
];

const generateStatus = (status) => {
  let color = '';
  switch (status) {
    case 'Chờ xác nhận':
      color = '#FF9900';
      break; // Orange
    case 'Đang xử lý':
      color = '#0000FF';
      break; // Blue
    case 'Đang vận chuyển':
      color = '#800080';
      break; // Purple
    case 'Đã giao hàng':
      color = '#008000';
      break; // Green
    case 'Đã hủy':
      color = '#FF0000';
      break; // Red
    case 'Hoàn tất':
      color = '#008080';
      break; // Teal
    default:
      color = 'gray';
  }
  return (
    <span
      style={{
        color: color,
        padding: '3px 8px',
        border: `1px solid ${color}`,
        borderRadius: '5px',
        backgroundColor: `${color}20`,
        textAlign: 'center',
        display: 'inline-block'
      }}
    >
      {statusSteps.find((item) => item.value === status)?.label}
    </span>
  );
};

const OrderDetailModal = ({ open, onClose, order, fetchOrders }) => {
  const [currentStatus, setCurrentStatus] = useState(order?.status);
  const [paidStatus, setPaidStatus] = useState(order?.paid);
  const address = `${order?.addressBook.address}, ${order?.addressBook.ward}, ${order?.addressBook.district}, ${order?.addressBook.city}, Việt Nam`;

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.value === currentStatus
  );

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setPaidStatus(order.paid);
    }
  }, [order]);

  const handleStatusClick = async (statusValue) => {
    try {
      await updateOrderStatus(order.id, statusValue);
      setCurrentStatus(statusValue);
      message.success(
        `Trạng thái đơn hàng đã cập nhật thành ${statusSteps.find(
          (item) => item.value === statusValue
        ).label}`
      );
      fetchOrders();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái đơn hàng");
    }
  };

  const handlePaidStatusChange = async () => {
    try {
      await updateOrderPaid(order.id, !paidStatus);
      setPaidStatus(!paidStatus);
      message.success(`Trạng thái thanh toán đã được cập nhật`);
      fetchOrders();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái thanh toán");
    }
  };

  const subTotal = order?.orderItems.reduce(
    (acc, item) => acc + item.priceAtPurchase * item.quantity,
    0
  );

  const discount = order?.voucher?.discountValue
    ? order.voucher.discountValue <= 100
      ? (subTotal * order.voucher.discountValue) / 100 // Giảm giá theo %
      : order.voucher.discountValue // Giảm giá theo số tiền
    : 0;

  return (
    <Modal
      title={`Chi tiết đơn hàng: #${order?.id}`}
      visible={open}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Row justify="space-between" align="middle">
        <h2>Order ID: {order?.id}</h2>
        {generateStatus(currentStatus)}
      </Row>
      <p style={{ color: "#6B7280" }}>
        Ngày đặt hàng: {new Date(order?.orderTime).toLocaleString()}
      </p>

      <Steps current={currentStatusIndex} size="small">
        {statusSteps.map((step) => (
          <Step
            key={step.value}
            title={step.label}
            onClick={() => handleStatusClick(step.value)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </Steps>

      <Divider />

      <Row gutter={[16, 16]}>
        {/* Left column: Order Items */}
        <Col span={14}>
          <h3>Sản phẩm trong đơn hàng</h3>
          <List
            itemLayout="horizontal"
            dataSource={order?.orderItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img
                      src={item.product.images?.[0] || Machine}
                      alt={item.product.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "0.5rem",
                      }}
                    />
                  }
                  title={<strong>{item.product.name}</strong>}
                  description={
                    <>
                      {item.variant && (
                        <p style={{ color: "gray" }}>
                          Lựa chọn: {item.variant.name}
                        </p>
                      )}
                      <p>Số lượng: {item.quantity}</p>
                      <p>Giá: {formatCurrency(item.priceAtPurchase)}</p>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          <Divider />
          <h3>Tổng cộng</h3>
          <Row justify="space-between">
            <Col>Tạm tính:</Col>
            <Col>{formatCurrency(subTotal) || 0}</Col>
          </Row>
          <Row justify="space-between">
            <Col>Giảm giá từ Voucher:</Col>
            <Col>- {formatCurrency(discount) || 0}</Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <strong>Tổng cộng:</strong>
            </Col>
            <Col>
              <strong>{formatCurrency(order?.totalAmount)}</strong>
            </Col>
          </Row>
        </Col>

        {/* Right column: Customer and Order Information */}
        <Col span={10}>
          <h3>Thanh toán</h3>
          <Switch
            checked={paidStatus}
            onChange={handlePaidStatusChange}
            checkedChildren="Đã thanh toán"
            unCheckedChildren="Chưa thanh toán"
          />
          <Divider />
          <h3>Thông tin khách hàng</h3>
          <p>Khách hàng: {order?.user?.profile?.fullName}</p>
          <p>Email: {order?.user?.profile?.email}</p>
          <p>Số điện thoại: {order?.user?.profile?.phoneNumber}</p>
          <Divider />
          <h3>Thông tin người nhận</h3>
          <p>Người nhận: {order?.addressBook?.recipientName}</p>
          <p>Số điện thoại: {order?.addressBook?.phoneNumber}</p>
          <Divider />
          <h3>Địa chỉ giao hàng</h3>
          <p>
            {order?.addressBook.address}, {order?.addressBook.ward},{" "}
            {order?.addressBook.district}, {order?.addressBook.city}
          </p>
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#fbbf24",
              textDecoration: "none",
            }}
          >
            <img
              src={MapImg}
              alt="Map Icon"
              style={{ width: "25px", height: "25px", borderRadius: "8px", marginRight: "8px" }}
            />
            <span>Xem bản đồ</span>
          </a>
          <div style={{ marginTop: "20px" }}>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="400"
              style={{ border: "0", borderRadius: "8px" }}
              allowFullScreen
            ></iframe>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default OrderDetailModal;
