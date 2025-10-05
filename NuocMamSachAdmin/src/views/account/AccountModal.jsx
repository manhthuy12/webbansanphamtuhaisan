import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import { createAccount, editAccount } from 'services/accountService'; // Import API cho tạo và chỉnh sửa tài khoản

const { Option } = Select;

const AccountModal = ({ open, onClose, fetchAccounts, profiles, accountData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accountData) {
      // Nếu có accountData, thiết lập giá trị form ban đầu
      form.setFieldsValue({
        username: accountData.username,
        profileId: accountData.profile?.id,
        role: accountData.role
      });
    } else {
      form.resetFields();
    }
  }, [accountData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (accountData) {
        // Nếu đang ở chế độ chỉnh sửa, gọi API editAccount
        await editAccount(accountData.id, {
          username: values.username,
          password: accountData.password,
          profileId: values.profileId,
          role: values.role
        });
        message.success('Cập nhật tài khoản thành công!');
      } else {
        // Nếu không có accountData, tạo tài khoản mới
        await createAccount({
          username: values.username,
          password: values.password,
          profileId: values.profileId,
          role: values.role
        });
        message.success('Tạo tài khoản thành công!');
      }
      form.resetFields();
      onClose();
      fetchAccounts();
    } catch (error) {
      message.error(accountData ? 'Lỗi khi cập nhật tài khoản!' : 'Người dùng này đã có tài khoản!');
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
  };

  return (
    <Modal title={accountData ? 'Chỉnh sửa tài khoản' : 'Tạo mới tài khoản'} visible={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên tài khoản" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}>
          <Input placeholder="Nhập tên tài khoản" disabled={!!accountData} />
        </Form.Item>

        {!accountData && (
          <>
            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={['password']}
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, { validator: validateConfirmPassword }]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </>
        )}

        <Form.Item label="Chọn hồ sơ" name="profileId" rules={[{ required: true, message: 'Vui lòng chọn hồ sơ!' }]}>
          <Select placeholder="Chọn hồ sơ">
            {profiles.map((profile) => (
              <Option key={profile.id} value={profile.id}>
                {profile.fullName} - {profile.email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Chọn vai trò" name="role" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
          <Select placeholder="Chọn vai trò">
            <Option value="ADMIN">ADMIN</Option>
            <Option value="USER">USER</Option>
            <Option value="STAFF">STAFF</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {accountData ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountModal;
