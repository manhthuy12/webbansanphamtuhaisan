import { useState, useEffect } from 'react';
import { Button, Table, Typography, Popconfirm, message, Input, Spin, Switch } from 'antd'; // Import thêm Switch từ antd
import MainCard from 'ui-component/cards/MainCard';
import { getAllVouchers, deleteVoucher, updateVoucher } from 'services/voucherService'; // Import từ voucher service
import VoucherModal from './VoucherModal'; // Import Modal cho create và update
import { debounce } from 'lodash'; // Sử dụng debounce để giảm số lần gọi API
import { formatCurrency } from 'utils/formatCurrency';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Biến lưu giá trị tìm kiếm
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 }); // Quản lý phân trang

  // Lấy danh sách voucher từ API
  const fetchVouchers = async (code = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllVouchers(code, page - 1, pageSize); // API trả về page từ 0
      setVouchers(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1, // Cập nhật trang hiện tại (+1 vì API page 0-based)
        pageSize: data.pageable.pageSize,
        total: data.totalElements // Tổng số voucher
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách voucher:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers(); // Lấy voucher ban đầu
  }, []);

  // Hàm mở modal để tạo mới hoặc cập nhật
  const handleOpenModal = (voucher = null) => {
    setCurrentVoucher(voucher);
    setModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentVoucher(null);
  };

  // Hàm xóa voucher với Popconfirm
  const handleDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id);
      message.success('Xóa voucher thành công!');
      fetchVouchers(searchTerm, pagination.current, pagination.pageSize); // Refresh voucher sau khi xóa
    } catch (error) {
      message.error('Lỗi khi xóa voucher!');
      console.error('Lỗi khi xóa voucher:', error);
    }
  };

  // Hàm xử lý tìm kiếm với debounce
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Đặt lại trang hiện tại về 1 khi tìm kiếm
    fetchVouchers(value, 1, pagination.pageSize); // Gọi API với page 1
  }, 800); // Chờ 800ms sau khi người dùng dừng nhập

  // Hàm xử lý khi người dùng chuyển trang
  const handleTableChange = (pagination) => {
    fetchVouchers(searchTerm, pagination.current, pagination.pageSize); // Gọi API lấy dữ liệu trang mới
  };

  // Hàm xử lý khi người dùng thay đổi trạng thái (bật/tắt switch)
  const handleSwitchChange = async (checked, record) => {
    try {
      const updatedVoucher = { ...record, active: checked };
      await updateVoucher(record.id, updatedVoucher);
      message.success('Cập nhật trạng thái thành công!');
      fetchVouchers(searchTerm, pagination.current, pagination.pageSize); // Refresh danh sách voucher
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái!');
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Giá trị giảm (% hoặc số tiền)',
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (discountValue) => (discountValue > 100 ? `${formatCurrency(discountValue)}` : `${discountValue}%`)
    },

    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : ''
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : ''
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleSwitchChange(checked, record)} // Thay đổi trạng thái khi bật/tắt switch
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => handleOpenModal(record)}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa voucher này?"
            onConfirm={() => handleDeleteVoucher(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger" style={{ marginLeft: '8px' }}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <MainCard title="Quản lý Voucher">
      {/* Sử dụng Flexbox để sắp xếp Input.Search và Button trên cùng một hàng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '40px' }}>
        <Input
          placeholder="Tìm kiếm voucher"
          onChange={(e) => handleSearch(e.target.value)} // Gọi khi người dùng nhập
          style={{ width: '80%', height: '40px' }} // Đặt chiều cao là 40px
        />
        <Button type="primary" onClick={() => handleOpenModal(null)} style={{ width: '10%', height: '40px' }}>
          Tạo mới voucher
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải voucher..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
          onChange={handleTableChange} // Gọi khi người dùng chuyển trang
          scroll={{ x: 1000 }}
        />
      )}

      {/* Modal để tạo và cập nhật voucher */}
      <VoucherModal
        open={modalOpen}
        onClose={handleCloseModal}
        voucher={currentVoucher} // null nếu là tạo mới, có giá trị nếu là cập nhật
        fetchVouchers={() => fetchVouchers(searchTerm, pagination.current, pagination.pageSize)} // Refresh voucher sau khi tạo/cập nhật
      />
    </MainCard>
  );
};

export default VoucherManagement;
