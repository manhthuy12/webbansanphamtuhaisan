import { useState, useEffect } from 'react';
import { Button, Table, Popconfirm, message, Input, Spin, Switch, Tag } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import { getAllAccounts, lockAccount } from 'services/accountService';
import AccountModal from './AccountModal';
import { debounce } from 'lodash';
import defaultAvatar from 'assets/images/machine.png';
import moment from 'moment';
import { getAllProfiles } from 'services/profileService';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // Dùng để lưu tài khoản được chọn để chỉnh sửa
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  // Lấy danh sách tài khoản từ API
  const fetchAccounts = async (username = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllAccounts(username, page - 1, pageSize);
      setAccounts(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài khoản:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getAllProfiles('', '', '', 0, 10);
        setProfiles(data.content);
      } catch (error) {
        message.error('Lỗi khi lấy danh sách hồ sơ!');
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpenModal = () => {
    setSelectedAccount(null); // Đặt null để tạo tài khoản mới
    setModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account); // Đặt tài khoản được chọn để chỉnh sửa
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLockAccount = async (id, locked) => {
    try {
      await lockAccount(id);
      message.success(`${locked ? 'Khóa' : 'Mở khóa'} tài khoản thành công!`);
      fetchAccounts(searchTerm, pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái tài khoản!');
      console.error('Lỗi khi cập nhật trạng thái tài khoản:', error);
    }
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchAccounts(value, 1, pagination.pageSize);
  }, 800);

  const handleTableChange = (pagination) => {
    fetchAccounts(searchTerm, pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: ['profile', 'avatar'],
      key: 'avatar',
      render: (avatar) => <img src={avatar || defaultAvatar} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: ['profile', 'email'],
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['profile', 'phoneNumber'],
      key: 'phoneNumber'
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points'
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = '';
        switch (role) {
          case 'ADMIN':
            color = 'green';
            break;
          case 'STAFF':
            color = 'blue';
            break;
          case 'USER':
            color = 'volcano';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{role}</Tag>;
      }
    },
    {
      title: 'Lần đăng nhập cuối',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      render: (lastLoginTime) => (lastLoginTime ? moment(lastLoginTime).format('DD/MM/YYYY HH:mm:ss') : 'Chưa đăng nhập')
    },
    {
      title: 'Trạng thái tài khoản',
      key: 'accountLocked',
      render: (text, record) => (
        <Popconfirm
          title={`Bạn có chắc muốn ${record.accountLocked ? 'mở khóa' : 'khóa'} tài khoản này không?`}
          onConfirm={() => handleLockAccount(record.id, !record.accountLocked)}
          okText="Có"
          cancelText="Không"
        >
          <Switch checked={!record.accountLocked} checkedChildren="Mở khóa" unCheckedChildren="Khóa" />
        </Popconfirm>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Button type="link" onClick={() => handleEditAccount(record)}>
          Chỉnh sửa
        </Button>
      )
    }
  ];

  return (
    <MainCard title="Quản lý tài khoản">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '40px' }}>
        <Input placeholder="Tìm kiếm tài khoản" onChange={(e) => handleSearch(e.target.value)} style={{ width: '80%', height: '40px' }} />
        <Button type="primary" onClick={handleOpenModal} style={{ width: '10%', height: '40px' }}>
          Tạo mới tài khoản
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải tài khoản..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={accounts}
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
      <AccountModal
        open={modalOpen}
        onClose={handleCloseModal}
        fetchAccounts={() => fetchAccounts(searchTerm, pagination.current, pagination.pageSize)}
        profiles={profiles}
        accountData={selectedAccount} // Truyền tài khoản được chọn cho modal
      />
    </MainCard>
  );
};

export default AccountManagement;
