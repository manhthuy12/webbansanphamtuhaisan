import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector và useDispatch
import { updateProfile } from 'services/profileService'; // Import API cập nhật
import { uploadToCloudinary } from 'utils/uploadImage'; // Import hàm upload ảnh
import { updateUser } from '../../../../store/userActions'; // Import updateUser action

const ProfileModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userInfo); // Lấy thông tin user từ Redux store
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.profile.fullName,
        email: userData.profile.email,
        phoneNumber: userData.profile.phoneNumber
      });
    }
  }, [form, userData]);

  // Hàm xử lý khi người dùng chọn ảnh mới
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Hàm xử lý khi người dùng submit cập nhật
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Nếu có file ảnh mới, upload ảnh lên Cloudinary
      const avatar =
        fileList.length > 0 && fileList[0].originFileObj ? await uploadToCloudinary(fileList[0].originFileObj) : userData.profile.avatar;

      const profileData = {
        ...values,
        avatar
      };

      // Gọi API cập nhật profile
      await updateProfile(userData.profile.id, profileData);
      message.success('Cập nhật hồ sơ thành công!');

      // Cập nhật Redux state sau khi thay đổi thành công
      dispatch(updateUser(profileData));

      onClose(); // Đóng modal sau khi cập nhật
    } catch (error) {
      message.error('Cập nhật hồ sơ thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thông tin cá nhân"
      visible={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="update" type="primary" onClick={form.submit} loading={loading}>
          Cập nhật
        </Button>
      ]}
    >
      {/* Hiển thị Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Upload listType="picture-card" beforeUpload={() => false} fileList={fileList} onChange={handleFileChange} showUploadList={false}>
          <img
            src={fileList.length > 0 ? URL.createObjectURL(fileList[0].originFileObj) : userData?.profile?.avatar || 'default-avatar.png'}
            alt="avatar"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </Upload>
        <Button icon={<UploadOutlined />} onClick={() => document.querySelector('.ant-upload input').click()}>
          Thay đổi avatar
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
