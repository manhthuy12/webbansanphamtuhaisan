import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createProfile, updateProfile } from 'services/profileService'; // Import các hàm từ profileService
import { uploadToCloudinary } from 'utils/uploadImage'; // Import hàm upload ảnh lên Cloudinary

const ProfileModal = ({ open, onClose, profile, fetchProfiles }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // Lưu danh sách file ảnh đã chọn

  // Khi modal mở và profile thay đổi, thiết lập lại form và fileList
  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...profile
      });
      setFileList(
        profile.avatar
          ? [
              {
                uid: '-1',
                name: 'avatar',
                status: 'done',
                url: profile.avatar
              }
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [profile, form]);

  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Nếu có file ảnh mới được chọn, upload lên Cloudinary
      const uploadedAvatar =
        fileList.length > 0 && fileList[0].originFileObj ? await uploadToCloudinary(fileList[0].originFileObj) : profile?.avatar || ''; // Nếu không có ảnh mới, giữ nguyên avatar cũ

      const profileData = {
        ...values,
        avatar: uploadedAvatar // Gán avatar sau khi upload
      };

      if (profile) {
        // Nếu đang chỉnh sửa, gọi API cập nhật
        await updateProfile(profile.id, profileData);
        message.success('Cập nhật hồ sơ thành công!');
      } else {
        // Nếu đang tạo mới, gọi API tạo mới
        await createProfile(profileData);
        message.success('Tạo mới hồ sơ thành công!');
      }

      fetchProfiles(); // Refresh danh sách hồ sơ
      onClose(); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi lưu hồ sơ:', error);
      message.error('Lỗi khi lưu hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal title={profile ? 'Cập nhật hồ sơ' : 'Tạo mới hồ sơ'} visible={open} onCancel={onClose} footer={null}>
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

        <Form.Item label="Avatar" name="avatar">
          <Upload
            listType="picture"
            beforeUpload={() => false} // Ngăn upload tự động, xử lý file upload thủ công
            fileList={fileList}
            onChange={handleFileChange}
            onRemove={() => setFileList([])} // Khi xóa ảnh, clear fileList
          >
            <Button icon={<UploadOutlined />}>Chọn Avatar</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {profile ? 'Cập nhật hồ sơ' : 'Tạo mới hồ sơ'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
