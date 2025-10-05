import { useState, useEffect } from 'react';
import { Button, Table, Tag, Popconfirm, message, Spin } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import { getAllOrders, updateOrderPaid } from 'services/orderService';
import OrderDetailModal from './OrderDetailModal';
import { formatCurrency } from 'utils/formatCurrency';

const generateInvoice = (order) => {
  if (!order) return;

  const address = `${order.addressBook.address}, ${order.addressBook.ward}, ${order.addressBook.district}, ${order.addressBook.city}`;

  // Tính tổng tiền gốc (chưa áp dụng voucher)
  const totalOriginal = order.orderItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtPurchase,
    0
  );

  const discountAmount = totalOriginal - order.totalAmount;

  const invoiceHTML = `
    <html>
    <head>
      <title>Hóa đơn #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: center; }
        th { background-color: #2980b9; color: white; }
        .header-section, .customer-section { display: flex; justify-content: space-between; margin-top: 10px; }
        .thank-you { margin-top: 30px; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="header-section">
        <div>
          <h1>Nước mắm Hùng An</h1>
          <p>Địa chỉ: TDP Hà Thanh, Phường Thanh Hải, Thị Xã Chũ, Tỉnh Bắc Giang</p>
          <p>SĐT: 0865 692 075</p>
        </div>
        <div>
          <h2>HÓA ĐƠN BÁN HÀNG</h2>
          <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
          <p><strong>Ngày đặt:</strong> ${new Date(order.orderTime).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> ${order.status}</p>
          <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
        </div>
      </div>

      <div class="customer-section">
        <div>
          <p><strong>Khách hàng:</strong> ${order.user.profile.fullName}</p>
          <p><strong>Email:</strong> ${order.user.profile.email}</p>
          <p><strong>SĐT:</strong> ${order.user.profile.phoneNumber}</p>
          <p><strong>Địa chỉ giao hàng:</strong> ${address}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá (VNĐ)</th>
            <th>Thành tiền (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
      .map(
        (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">${item.priceAtPurchase.toLocaleString("vi-VN")}</td>
                <td style="text-align: right;">${(item.quantity * item.priceAtPurchase).toLocaleString("vi-VN")}</td>
              </tr>
            `
      )
      .join("")}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px;">
        <p><strong>Tổng tiền gốc:</strong> ${totalOriginal.toLocaleString("vi-VN")} VNĐ</p>
        ${discountAmount > 0
      ? `<p><strong>Giảm giá:</strong> -${discountAmount.toLocaleString("vi-VN")} VNĐ</p>`
      : ""
    }
        <h3><strong>Tổng thanh toán:</strong> ${order.totalAmount.toLocaleString("vi-VN")} VNĐ</h3>
      </div>

      <p class="thank-you">
        Cảm ơn quý khách đã mua hàng tại cửa hàng chúng tôi!<br/>
        Hotline: 0123 456 789
      </p>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  } else {
    alert("Vui lòng cho phép bật popup để in hóa đơn!");
  }
};


const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  const fetchOrders = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllOrders(null, null, null, null, page - 1, pageSize);
      setOrders(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenModal = (order = null) => {
    setCurrentOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentOrder(null);
  };

  const handleUpdateOrderPaid = async (id, paid) => {
    try {
      await updateOrderPaid(id, paid);
      message.success('Cập nhật trạng thái thanh toán thành công!');
      fetchOrders(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái thanh toán!');
      console.error(error);
    }
  };

  const handleTableChange = (pagination) => {
    fetchOrders(pagination.current, pagination.pageSize);
  };

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
        break;
      case 'Đang xử lý':
        color = '#0000FF';
        break;
      case 'Đang vận chuyển':
        color = '#800080';
        break;
      case 'Đã giao hàng':
        color = '#008000';
        break;
      case 'Đã hủy':
        color = '#FF0000';
        break;
      case 'Hoàn tất':
        color = '#008080';
        break;
      default:
        color = 'gray';
    }
    return (
      <span
        style={{
          color,
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

  const getPaymentMethodTag = (method) => {
    switch (method) {
      case 'Credit Card':
        return <Tag color="blue">Thẻ tín dụng</Tag>;
      case 'MoMo':
        return <Tag color="purple">MoMo</Tag>;
      case 'Cash on Delivery':
        return <Tag color="cyan">Thanh toán khi nhận hàng</Tag>;
      default:
        return <Tag color="default">{method}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Người đặt',
      dataIndex: ['user', 'profile', 'fullName'],
      key: 'fullName'
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (orderTime) =>
        new Date(orderTime).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => getPaymentMethodTag(method)
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'orderType',
      key: 'orderType',
      align: 'center',
      render: (orderType) => (
        <Tag color={orderType === 'ONLINE' ? 'blue' : 'green'} style={{ fontWeight: 600 }}>
          {orderType === 'ONLINE' ? 'Online' : 'Tại quầy'}
        </Tag>
      )
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status) => generateStatus(status)
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paid',
      key: 'paid',
      render: (paid, record) => (
        <Popconfirm
          title={`Bạn có muốn cập nhật trạng thái thanh toán thành ${paid ? 'chưa' : 'đã'} thanh toán?`}
          onConfirm={() => handleUpdateOrderPaid(record.id, !paid)}
          okText="Có"
          cancelText="Không"
        >
          <Tag color={paid ? 'green' : 'red'}>{paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Tag>
        </Popconfirm>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleOpenModal(record)}>
            Chi tiết
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => generateInvoice(record)}
          >
            In hóa đơn
          </Button>
        </>
      )
    }
  ];

  return (
    <MainCard title="Quản lý Đơn hàng">
      {loading ? (
        <Spin
          tip="Đang tải đơn hàng..."
          style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      )}

      <OrderDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        order={currentOrder}
        fetchOrders={() => fetchOrders(pagination.current, pagination.pageSize)}
      />
    </MainCard>
  );
};

export default OrderManagement;
