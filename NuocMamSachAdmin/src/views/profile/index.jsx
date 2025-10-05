import { useState, useEffect } from 'react';
import { Button, Table, Popconfirm, message, Input, Spin, Row, Col } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import { getAllProfiles, deleteProfile } from 'services/profileService'; // Gọi API từ profileService
import ProfileModal from './ProfileModal'; // Import Modal cho create và update
import { debounce } from 'lodash';
import defaultAvatar from 'assets/images/machine.png'; // Ảnh avatar mặc định

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState({ name: '', phoneNumber: '', email: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  // Lấy danh sách hồ sơ từ API
  const fetchProfiles = async (name = '', phoneNumber = '', email = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllProfiles(name, phoneNumber, email, page - 1, pageSize);
      setProfiles(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOpenModal = (profile = null) => {
    setCurrentProfile(profile);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentProfile(null);
  };

  const handleDeleteProfile = async (id) => {
    try {
      await deleteProfile(id);
      message.success('Xóa hồ sơ thành công!');
      fetchProfiles(searchTerm.name, searchTerm.phoneNumber, searchTerm.email, pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa hồ sơ!');
      console.error('Lỗi khi xóa hồ sơ:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const delayedSearch = debounce(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchProfiles(searchTerm.name, searchTerm.phoneNumber, searchTerm.email, 1, pagination.pageSize);
    }, 800);

    delayedSearch();

    return () => {
      delayedSearch.cancel();
    };
  }, [searchTerm, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    fetchProfiles(searchTerm.name, searchTerm.phoneNumber, searchTerm.email, pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => (
        <img
          src={avatar || defaultAvatar} // Hiển thị avatar hoặc ảnh mặc định
          alt="avatar"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      )
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address'
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
            title="Bạn có chắc chắn muốn xóa hồ sơ này?"
            onConfirm={() => handleDeleteProfile(record.id)}
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
    <MainCard title="Quản lý hồ sơ">
      <div style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="Tìm theo tên"
              name="name"
              value={searchTerm.name}
              onChange={handleInputChange}
              allowClear
              style={{ height: '40px' }}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Tìm theo số điện thoại"
              name="phoneNumber"
              value={searchTerm.phoneNumber}
              onChange={handleInputChange}
              allowClear
              style={{ height: '40px' }}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Tìm theo email"
              name="email"
              value={searchTerm.email}
              onChange={handleInputChange}
              allowClear
              style={{ height: '40px' }}
            />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={() => handleOpenModal(null)} style={{ width: '100%', height: '40px' }}>
              Thêm mới người dùng
            </Button>
          </Col>
        </Row>
      </div>

      {loading ? (
        <Spin tip="Đang tải hồ sơ..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={profiles}
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

      <ProfileModal
        open={modalOpen}
        onClose={handleCloseModal}
        profile={currentProfile}
        fetchProfiles={() =>
          fetchProfiles(searchTerm.name, searchTerm.phoneNumber, searchTerm.email, pagination.current, pagination.pageSize)
        }
      />
    </MainCard>
  );
};

export default ProfileManagement;
