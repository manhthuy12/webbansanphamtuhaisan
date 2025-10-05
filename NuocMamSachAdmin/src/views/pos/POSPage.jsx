import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, Select, Modal, InputNumber, Tag, Space,
  Divider, Popconfirm, Typography, message, Spin, Row, Col, Card
} from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import { getAllProducts } from 'services/productService';
import { getAllAccounts } from 'services/accountService';
import { getVoucherByCode } from 'services/voucherService';
import { createOrder } from 'services/orderService';

const { Option } = Select;
const { Title, Text } = Typography;

const LOCAL_STORAGE_KEY = 'pos_pending_orders';

const POSPage = () => {
  // State
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [paid, setPaid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrderIdx, setActiveOrderIdx] = useState(null);
  const [printingOrder, setPrintingOrder] = useState(null);

  // Fetch data
  useEffect(() => {
    getAllProducts('', '', 0, 1000).then(res => setProducts(res.content || []));
    getAllAccounts('', 0, 1000).then(res => {
      // Chỉ lấy account có role là USER
      setUsers((res.content || []).filter(acc => acc.role === 'USER'));
    });
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    setPendingOrders(saved ? JSON.parse(saved) : []);
  }, []);

  // Tính số tiền giảm giá
  const getDiscountAmount = (voucher, cart) => {
    if (!voucher) return 0;
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (voucher.discountValue < 100) {
      return Math.round(total * (voucher.discountValue / 100));
    }
    return voucher.discountValue;
  };

  // Tổng tiền (có voucher)
  const calcTotal = () => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = getDiscountAmount(voucher, cart);
    total = Math.max(0, total - discount);
    return total;
  };

  // Thêm sản phẩm vào giỏ (chọn variant hoặc không)
  const handleAddToCart = (product, variant) => {
    setCart(prev => {
      const exist = prev.find(
        item => item.productId === product.id && item.variantId === (variant?.id || null)
      );
      if (exist) {
        return prev.map(item =>
          item.productId === product.id && item.variantId === (variant?.id || null)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        variantId: variant?.id || null,
        variantName: variant?.name || '',
        price: variant?.price || product.price,
        quantity: 1
      }];
    });
  };

  // Sửa số lượng
  const handleChangeQuantity = (productId, variantId, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Xoá khỏi giỏ
  const handleRemoveFromCart = (productId, variantId) => {
    setCart(prev =>
      prev.filter(item => !(item.productId === productId && item.variantId === variantId))
    );
  };

  // Lưu đơn tạm
  const handleSavePendingOrder = () => {
    if (!selectedUser || cart.length === 0) {
      message.warning('Chọn khách hàng và sản phẩm!');
      return;
    }
    let newPending = [...pendingOrders];
    const orderData = {
      cart,
      selectedUser,
      voucherCode,
      voucher,
      paymentMethod,
      paid,
      time: new Date().toISOString()
    };
    if (activeOrderIdx !== null) {
      newPending[activeOrderIdx] = orderData;
    } else {
      newPending = [orderData, ...newPending].slice(0, 5);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPending));
    setPendingOrders(newPending);
    setActiveOrderIdx(null);
    setCart([]);
    setVoucherCode('');
    setVoucher(null);
    message.success('Đã lưu đơn hàng tạm!');
  };

  // Chọn đơn tạm để chỉnh sửa
  const handleSwitchPendingOrder = idx => {
    const order = pendingOrders[idx];
    setCart(order.cart);
    setSelectedUser(order.selectedUser);
    setVoucherCode(order.voucherCode);
    setVoucher(order.voucher);
    setPaymentMethod(order.paymentMethod);
    setPaid(order.paid);
    setActiveOrderIdx(idx);
  };

  // Xoá đơn tạm
  const handleDeletePendingOrder = idx => {
    const newPending = pendingOrders.filter((_, i) => i !== idx);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPending));
    setPendingOrders(newPending);
    if (activeOrderIdx === idx) {
      setCart([]);
      setSelectedUser(null);
      setVoucherCode('');
      setVoucher(null);
      setActiveOrderIdx(null);
    }
  };

  // Thanh toán (gửi lên server, in hóa đơn, xóa đơn tạm nếu đang chỉnh)
  const handleCheckout = async () => {
    if (!selectedUser || cart.length === 0) {
      message.warning('Chọn khách hàng và sản phẩm!');
      return;
    }
    const orderItems = cart.map(item => ({
      product: { id: item.productId, name: item.productName }, // giữ cả name để in hóa đơn
      quantity: item.quantity,
      variant: item.variantId ? { id: item.variantId, name: item.variantName } : undefined,
      priceAtPurchase: item.price
    }));
    const discountAmount = getDiscountAmount(voucher, cart);
    const orderData = {
      status: "Chờ xác nhận",
      totalAmount: calcTotal(),
      paymentMethod,
      paid,
      orderTime: new Date().toISOString(),
      orderItems
    };
    setLoading(true);
    try {
      // Gửi order lên server (không cần lấy thông tin sản phẩm từ response)
      const res = await createOrder(
        selectedUser,
        orderData.totalAmount,
        paymentMethod,
        paid,
        orderItems,
        null, // addressId
        voucherCode
      );
      message.success('Thanh toán thành công!');
      // Lấy dữ liệu in hóa đơn từ frontend (cart, user, voucher, discountAmount)
      setPrintingOrder({
        ...orderData,
        id: res.id, // lấy id đơn hàng từ response nếu muốn
        user: users.find(u => u.id === selectedUser),
        voucher,
        voucherCode,
        discountAmount
      });
      if (activeOrderIdx !== null) handleDeletePendingOrder(activeOrderIdx);
      setCart([]);
      setSelectedUser(null);
      setVoucherCode('');
      setVoucher(null);
      setActiveOrderIdx(null);
    } catch (e) {
      message.error('Thanh toán thất bại!');
    }
    setLoading(false);
  };


  // In hóa đơn HTML
  const handlePrintInvoice = (order) => {
    if (!order) return;
    const user = order.user || users.find(u => u.id === order.userId) || {};
    const discountAmount = order.discountAmount || 0;
    const totalOriginal = order.orderItems
      ? order.orderItems.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0)
      : 0;
    const invoiceHTML = `
    <html>
    <head>
      <title>Hóa đơn #${order.id || ''}</title>
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
          <p><strong>Mã đơn hàng:</strong> ${order.id || ''}</p>
          <p><strong>Ngày đặt:</strong> ${new Date(order.orderTime).toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
      <div class="customer-section">
        <div>
          <p><strong>Khách hàng:</strong> ${user?.profile?.fullName || ''}</p>
          <p><strong>Email:</strong> ${user?.profile?.email || ''}</p>
          <p><strong>SĐT:</strong> ${user?.profile?.phoneNumber || ''}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Biến thể</th>
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
                  <td>${item.product?.name || ''}</td>
                  <td>${item.variant?.name || '-'}</td>
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
        Hotline: 0865 692 075
      </p>
    </body>
    </html>
  `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  // Cột sản phẩm
  const productColumns = [
    {
      title: 'Ảnh',
      dataIndex: 'images',
      key: 'images',
      render: images => images?.[0] ? <img src={images[0]} alt="" style={{ width: 50, borderRadius: 8 }} /> : null
    },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: quantity => <Tag color={quantity > 0 ? 'green' : 'red'}>{quantity}</Tag>
    },
    {
      title: 'Biến thể',
      key: 'variants',
      render: (text, record) => (
        <Space direction="vertical">
          {record.variants && record.variants.filter(v => !v.deleted).length > 0
            ? record.variants.filter(v => !v.deleted).map(variant => (
              <div key={variant.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button
                  size="small"
                  onClick={() => handleAddToCart(record, variant)}
                  disabled={variant.quantity <= 0}
                >
                  {variant.name} - {variant.price.toLocaleString()} đ
                </Button>
                <Tag color={variant.quantity > 0 ? 'blue' : 'red'}>Tồn: {variant.quantity}</Tag>
              </div>
            ))
            : (
              <Button
                type="primary"
                size="small"
                onClick={() => handleAddToCart(record, null)}
                disabled={record.quantity <= 0}
              >
                {record.price.toLocaleString()} đ
                {record.quantity <= 0 && <Tag color="red" style={{ marginLeft: 8 }}>Hết hàng</Tag>}
              </Button>
            )
          }
        </Space>
      )
    }
  ];

  // Cột giỏ hàng
  const cartColumns = [
    { title: 'Tên', dataIndex: 'productName', key: 'productName' },
    { title: 'Biến thể', dataIndex: 'variantName', key: 'variantName' },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: price => <Text>{price.toLocaleString()} đ</Text>
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={100}
          value={quantity}
          onChange={value => handleChangeQuantity(record.productId, record.variantId, value)}
        />
      )
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (text, record) => (
        <Text strong>{(record.price * record.quantity).toLocaleString()} đ</Text>
      )
    },
    {
      title: 'Xoá',
      key: 'remove',
      render: (text, record) => (
        <Popconfirm
          title="Xoá sản phẩm khỏi giỏ?"
          onConfirm={() => handleRemoveFromCart(record.productId, record.variantId)}
        >
          <Button danger size="small">Xoá</Button>
        </Popconfirm>
      )
    }
  ];

  // Modal hóa đơn
  const renderInvoiceModal = () => (
    <Modal
      open={!!printingOrder}
      onCancel={() => setPrintingOrder(null)}
      footer={[
        <Button key="print" type="primary" onClick={() => handlePrintInvoice(printingOrder)}>
          In hóa đơn
        </Button>
      ]}
      width={700}
      title="Hóa đơn bán hàng"
    >
      {printingOrder && (
        <div>
          <Title level={4}>Hóa đơn bán hàng</Title>
          <Text>Ngày: {new Date(printingOrder.orderTime).toLocaleString()}</Text>
          <Divider />
          <Table
            dataSource={printingOrder.orderItems}
            columns={[
              { title: 'SP', dataIndex: ['product', 'name'], key: 'productName', render: (_, r) => r.product?.name || '' },
              { title: 'Biến thể', dataIndex: ['variant', 'name'], key: 'variantName', render: (_, r) => r.variant?.name || '-' },
              { title: 'SL', dataIndex: 'quantity', key: 'quantity' },
              { title: 'Đơn giá', dataIndex: 'priceAtPurchase', key: 'priceAtPurchase', render: v => v.toLocaleString() + ' đ' },
              { title: 'Thành tiền', key: 'total', render: (_, r) => (r.priceAtPurchase * r.quantity).toLocaleString() + ' đ' }
            ]}
            rowKey={(_, idx) => idx}
            pagination={false}
            size="small"
          />
          <Divider />
          <div style={{ textAlign: 'right' }}>
            <Text strong>Tổng tiền gốc: </Text>
            <Text>{printingOrder.orderItems.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0).toLocaleString()} đ</Text>
            <br />
            {printingOrder.discountAmount > 0 && (
              <>
                <Text strong>Giảm giá: </Text>
                <Text type="danger">-{printingOrder.discountAmount.toLocaleString()} đ</Text>
                <br />
              </>
            )}
            <Text strong>Tổng thanh toán: </Text>
            <Text strong type="danger" style={{ fontSize: 18 }}>{printingOrder.totalAmount.toLocaleString()} đ</Text>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <MainCard title="Bán hàng tại quầy (POS)">
      <Spin spinning={loading}>
        <Row gutter={0} style={{ minHeight: 600 }}>
          {/* Bên trái: Giỏ hàng + thông tin khách (4/10) */}
          <Col xs={24} md={10}>
            <Card
              title="Giỏ hàng & Thông tin khách"
              style={{ minHeight: 600, borderRadius: 0, borderRight: '1px solid #f0f0f0' }}
              bodyStyle={{ padding: 16 }}
            >
              {/* Chọn khách hàng */}
              <div style={{ marginBottom: 12 }}>
                <Text strong>Khách hàng:</Text>
                <Select
                  showSearch
                  placeholder="Chọn khách hàng"
                  style={{ width: '100%', marginTop: 4 }}
                  value={selectedUser}
                  onChange={setSelectedUser}
                  filterOption={(input, option) =>
                    (option.children || '').toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                  allowClear
                >
                  {users.map(user => (
                    <Option key={user.id} value={user.id}>
                      {user.profile?.fullName || user.username}
                    </Option>
                  ))}
                </Select>
              </div>
              {/* Voucher */}
              <div style={{ marginBottom: 12 }}>
                <Text strong>Voucher:</Text>
                <Input.Search
                  placeholder="Nhập mã voucher"
                  value={voucherCode}
                  onChange={e => setVoucherCode(e.target.value)}
                  onSearch={async () => {
                    if (!voucherCode) return setVoucher(null);
                    setLoading(true);
                    try {
                      const res = await getVoucherByCode(voucherCode);
                      setVoucher(res);
                      message.success('Áp dụng voucher thành công!');
                    } catch {
                      setVoucher(null);
                      message.error('Voucher không hợp lệ!');
                    }
                    setLoading(false);
                  }}
                  enterButton="Áp dụng"
                  style={{ marginTop: 4 }}
                />
                {voucher && (
                  <Tag color="green" style={{ marginTop: 8 }}>
                    {voucher.discountValue < 100
                      ? `Giảm ${voucher.discountValue}% (${getDiscountAmount(voucher, cart).toLocaleString()} đ)`
                      : `Giảm ${voucher.discountValue.toLocaleString()} đ`}
                  </Tag>
                )}
              </div>
              {/* Phương thức thanh toán */}
              <div style={{ marginBottom: 12 }}>
                <Text strong>Phương thức thanh toán:</Text>
                <Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: '100%', marginTop: 4 }}>
                  <Option value="COD">Tiền mặt</Option>
                  <Option value="CARD">Thẻ</Option>
                  <Option value="BANK">Chuyển khoản</Option>
                </Select>
              </div>
              {/* Trạng thái thanh toán */}
             
              {/* Bảng giỏ hàng */}
              <Table
                columns={cartColumns}
                dataSource={cart}
                rowKey={r => r.productId + '-' + (r.variantId || '')}
                pagination={false}
                size="small"
                summary={() => {
                  const discount = getDiscountAmount(voucher, cart);
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={4} align="right">
                          <Text strong>Tổng tiền gốc:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4} colSpan={2}>
                          <Text>{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} đ</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      {discount > 0 && (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={4} align="right">
                            <Text strong>Giảm giá:</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} colSpan={2}>
                            <Text type="danger">-{discount.toLocaleString()} đ</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={4} align="right">
                          <Text strong>Tổng thanh toán:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4} colSpan={2}>
                          <Text strong type="danger" style={{ fontSize: 18 }}>
                            {calcTotal().toLocaleString()} đ
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
              {/* Hai nút tách biệt */}
              <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Button
                  type="default"
                  size="large"
                  style={{ marginRight: 8 }}
                  onClick={handleSavePendingOrder}
                  disabled={cart.length === 0 || !selectedUser}
                >
                  Tạo đơn hàng tạm
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || !selectedUser}
                >
                  Thanh toán
                </Button>
              </div>
              {/* Đơn hàng tạm, cho phép switch */}
              <Divider />
              <Title level={5} style={{ marginTop: 12 }}>Đơn hàng tạm (tối đa 5)</Title>
              {pendingOrders.length === 0 && <Text type="secondary">Chưa có đơn hàng tạm</Text>}
              <ul style={{ paddingLeft: 18 }}>
                {pendingOrders.map((order, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <Space>
                      <Button
                        type={activeOrderIdx === idx ? "primary" : "default"}
                        size="small"
                        onClick={() => handleSwitchPendingOrder(idx)}
                      >
                        Đơn {idx + 1}
                      </Button>
                      <span>
                        {new Date(order.time).toLocaleTimeString()} - {order.cart.length} SP - {order.paymentMethod}
                      </span>
                      <Button danger size="small" onClick={() => handleDeletePendingOrder(idx)}>
                        Xoá
                      </Button>
                    </Space>
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
          {/* Bên phải: Danh sách sản phẩm (6/10) */}
          <Col xs={24} md={14}>
            <Card
              title="Danh sách sản phẩm"
              style={{ minHeight: 600, borderRadius: 0 }}
              bodyStyle={{ padding: 16 }}
            >
              <Input.Search
                placeholder="Tìm kiếm sản phẩm"
                onSearch={name => getAllProducts(name, '', 0, 30).then(res => setProducts(res.content || []))}
                style={{ width: 400, marginBottom: 12 }}
                allowClear
              />
              <Table
                columns={productColumns}
                dataSource={products}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                size="small"
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        </Row>
        {renderInvoiceModal()}
      </Spin>
    </MainCard>
  );
};

export default POSPage;
