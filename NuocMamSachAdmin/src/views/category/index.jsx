import { useState, useEffect } from 'react';
import { Button, Table, Typography, Popconfirm, message, Input, Spin } from 'antd'; // Import thêm Spin từ antd
import MainCard from 'ui-component/cards/MainCard';
import { getAllCategories, deleteCategory } from 'services/categoryService';
import CategoryModal from './CategoryModal'; // Import Modal cho create và update
import { debounce } from 'lodash'; // Sử dụng debounce để giảm số lần gọi API
import defaultImage from 'assets/images/machine.png';
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Biến lưu giá trị tìm kiếm
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 }); // Quản lý phân trang

  // Lấy danh sách danh mục từ API
  const fetchCategories = async (name = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllCategories(name, page - 1, pageSize); // API trả về page từ 0
      setCategories(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1, // Cập nhật trang hiện tại (+1 vì API page 0-based)
        pageSize: data.pageable.pageSize,
        total: data.totalElements // Tổng số danh mục
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(); // Lấy danh mục ban đầu
  }, []);

  // Hàm mở modal để tạo mới hoặc cập nhật
  const handleOpenModal = (category = null) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentCategory(null);
  };

  // Hàm xóa danh mục với Popconfirm
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      message.success('Xóa danh mục thành công!');
      fetchCategories(searchTerm, pagination.current, pagination.pageSize); // Refresh danh mục sau khi xóa
    } catch (error) {
      message.error('Lỗi khi xóa danh mục!');
      console.error('Lỗi khi xóa danh mục:', error);
    }
  };

  // Hàm xử lý tìm kiếm với debounce
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Đặt lại trang hiện tại về 1 khi tìm kiếm
    fetchCategories(value, 1, pagination.pageSize); // Gọi API với page 1
  }, 800); // Chờ 500ms sau khi người dùng dừng nhập

  // Hàm xử lý khi người dùng chuyển trang
  const handleTableChange = (pagination) => {
    fetchCategories(searchTerm, pagination.current, pagination.pageSize); // Gọi API lấy dữ liệu trang mới
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name'
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
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
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
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDeleteCategory(record.id)}
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
    <MainCard title="Quản lý danh mục">
      {/* Sử dụng Flexbox để sắp xếp Input.Search và Button trên cùng một hàng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '40px' }}>
        <Input
          placeholder="Tìm kiếm danh mục"
          onChange={(e) => handleSearch(e.target.value)} // Gọi khi người dùng nhập
          style={{ width: '80%', height: '40px' }} // Đặt chiều cao là 40px
        />
        <Button type="primary" onClick={() => handleOpenModal(null)} style={{ width: '10%', height: '40px' }}>
          Tạo mới danh mục
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải danh mục..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={categories}
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

      {/* Modal để tạo và cập nhật danh mục */}
      <CategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={currentCategory} // null nếu là tạo mới, có giá trị nếu là cập nhật
        fetchCategories={() => fetchCategories(searchTerm, pagination.current, pagination.pageSize)} // Refresh danh mục sau khi tạo/cập nhật
      />
    </MainCard>
  );
};

export default CategoryManagement;
