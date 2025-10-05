import { useState, useEffect } from 'react';
import { Button, Table, Popconfirm, message, Input, Spin } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import { getAllAccessories, deleteAccessory } from 'services/accessoryService'; // Import dịch vụ phụ kiện
import AccessoryModal from './AccessoryModal'; // Import AccessoryModal
import defaultImage from 'assets/images/machine.png';
import { formatCurrency } from 'utils/formatCurrency';
import { debounce } from 'lodash';

const AccessoryManagement = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [modalOpen, setModalOpen] = useState(false); // Quản lý trạng thái mở/đóng modal
  const [currentAccessory, setCurrentAccessory] = useState(null); // Phụ kiện hiện tại khi sửa

  const fetchAccessories = async (name = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllAccessories(name, page - 1, pageSize);
      setAccessories(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phụ kiện:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const handleDeleteAccessory = async (id) => {
    try {
      await deleteAccessory(id);
      message.success('Xóa phụ kiện thành công!');
      fetchAccessories(searchTerm, pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa phụ kiện!');
    }
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchAccessories(value, 1, pagination.pageSize);
  }, 800);

  const handleTableChange = (pagination) => {
    fetchAccessories(searchTerm, pagination.current, pagination.pageSize);
  };

  const handleOpenCreateModal = () => {
    setCurrentAccessory(null); // Reset phụ kiện hiện tại để tạo mới
    setModalOpen(true); // Mở modal
  };

  const handleOpenEditModal = (accessory) => {
    setCurrentAccessory(accessory); // Đặt phụ kiện hiện tại để sửa
    setModalOpen(true); // Mở modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Đóng modal
    setCurrentAccessory(null); // Reset phụ kiện hiện tại
  };

  const columns = [
    {
      title: 'Tên phụ kiện',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${formatCurrency(price)}`
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img
          src={image || defaultImage} // Hiển thị ảnh phụ kiện hoặc ảnh mặc định
          alt="accessory"
          style={{ width: '50px', height: '50px', borderRadius: '10px' }}
        />
      )
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Sản phẩm liên kết',
      dataIndex: ['product', 'name'], // Lấy tên sản phẩm liên kết
      key: 'productName'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => handleOpenEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phụ kiện này?"
            onConfirm={() => handleDeleteAccessory(record.id)}
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
    <MainCard title="Quản lý phụ kiện">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '40px' }}>
        <Input
          placeholder="Tìm kiếm phụ kiện"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '80%', height: '40px' }}
          allowClear
        />
        <Button type="primary" onClick={handleOpenCreateModal} style={{ marginLeft: '16px', height: '40px' }}>
          Thêm phụ kiện
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải phụ kiện..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={accessories}
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

      <AccessoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        accessory={currentAccessory}
        fetchAccessories={() => fetchAccessories(searchTerm, pagination.current, pagination.pageSize)}
      />
    </MainCard>
  );
};

export default AccessoryManagement;
