import { useState, useEffect } from 'react';
import { Button, Table, Typography, Popconfirm, message, Input, Spin } from 'antd'; // Import thêm Spin từ antd
import MainCard from 'ui-component/cards/MainCard';
import { getAllNews, deleteNews } from 'services/newsService';
import NewsModal from './NewsModal'; // Import Modal cho create và update
import { debounce } from 'lodash'; // Sử dụng debounce để giảm số lần gọi API

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Biến lưu giá trị tìm kiếm
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 }); // Quản lý phân trang

  // Lấy danh sách tin tức từ API
  const fetchNews = async (title = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllNews(title, page - 1, pageSize); // API trả về page từ 0
      setNews(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1, // Cập nhật trang hiện tại (+1 vì API page 0-based)
        pageSize: data.pageable.pageSize,
        total: data.totalElements // Tổng số tin tức
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tin tức:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(); // Lấy tin tức ban đầu
  }, []);

  // Hàm mở modal để tạo mới hoặc cập nhật
  const handleOpenModal = (news = null) => {
    setCurrentNews(news);
    setModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentNews(null);
  };

  // Hàm xóa tin tức với Popconfirm
  const handleDeleteNews = async (id) => {
    try {
      await deleteNews(id);
      message.success('Xóa tin tức thành công!');
      fetchNews(searchTerm, pagination.current, pagination.pageSize); // Refresh danh sách tin tức sau khi xóa
    } catch (error) {
      message.error('Lỗi khi xóa tin tức!');
      console.error('Lỗi khi xóa tin tức:', error);
    }
  };

  // Hàm xử lý tìm kiếm với debounce
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Đặt lại trang hiện tại về 1 khi tìm kiếm
    fetchNews(value, 1, pagination.pageSize); // Gọi API với page 1
  }, 800); // Chờ 500ms sau khi người dùng dừng nhập

  // Hàm xử lý khi người dùng chuyển trang
  const handleTableChange = (pagination) => {
    fetchNews(searchTerm, pagination.current, pagination.pageSize); // Gọi API lấy dữ liệu trang mới
  };

  const columns = [
    {
      title: 'Tiêu đề tin tức',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="news" style={{ width: '50px', height: '50px', borderRadius: '10px' }} />
    },
    {
      title: 'Ngày xuất bản',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Chưa xuất bản'
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
            title="Bạn có chắc chắn muốn xóa tin tức này?"
            onConfirm={() => handleDeleteNews(record.id)}
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
    <MainCard title="Quản lý tin tức">
      {/* Sử dụng Flexbox để sắp xếp Input.Search và Button trên cùng một hàng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '40px' }}>
        <Input
          placeholder="Tìm kiếm tin tức"
          onChange={(e) => handleSearch(e.target.value)} // Gọi khi người dùng nhập
          style={{ width: '80%', height: '40px' }} // Đặt chiều cao là 40px
        />
        <Button type="primary" onClick={() => handleOpenModal(null)} style={{ width: '10%', height: '40px' }}>
          Tạo mới tin tức
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải tin tức..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={news}
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

      {/* Modal để tạo và cập nhật tin tức */}
      <NewsModal
        open={modalOpen}
        onClose={handleCloseModal}
        news={currentNews} // null nếu là tạo mới, có giá trị nếu là cập nhật
        fetchNews={() => fetchNews(searchTerm, pagination.current, pagination.pageSize)} // Refresh danh mục sau khi tạo/cập nhật
      />
    </MainCard>
  );
};

export default NewsManagement;
