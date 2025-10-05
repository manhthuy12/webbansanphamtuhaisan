import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, message, DatePicker, Switch } from 'antd';
import { createVoucher, updateVoucher } from 'services/voucherService';
import moment from 'moment';

const VoucherModal = ({ open, onClose, voucher, fetchVouchers }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false); // Trạng thái loading khi submit

  useEffect(() => {
    if (voucher) {
      form.setFieldsValue({
        code: voucher.code,
        discountValue: voucher.discountValue,
        startDate: moment(voucher.startDate, 'YYYY-MM-DD'),
        endDate: moment(voucher.endDate, 'YYYY-MM-DD'),
        active: voucher.active
      });
    } else {
      form.resetFields();
    }
  }, [voucher, form]);

  // Hàm xử lý khi submit form
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const newData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };

      if (voucher) {
        // Cập nhật voucher
        await updateVoucher(voucher.id, newData);
        message.success('Cập nhật voucher thành công!');
      } else {
        // Tạo mới voucher
        await createVoucher(newData);
        message.success('Tạo mới voucher thành công!');
      }
      form.resetFields();
      fetchVouchers(); // Refresh danh sách voucher sau khi thành công
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      message.error('Lỗi khi tạo/cập nhật voucher!');
      console.error('Lỗi khi tạo/cập nhật voucher:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={voucher ? 'Cập nhật voucher' : 'Tạo mới voucher'}
      visible={open}
      onCancel={onClose}
      footer={null} // Sử dụng custom footer trong form
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          code: '',
          discountValue: 0,
          startDate: null,
          endDate: null,
          active: true
        }}
      >
        <Form.Item label="Mã giảm giá" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]}>
          <Input placeholder="Nhập mã giảm giá" />
        </Form.Item>

        <Form.Item
          label="Giá trị giảm"
          name="discountValue"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' }]}
          help="Nhập % khi <= 100 và số tiền VNĐ khi > 100" // Dòng mô tả bên dưới
        >
          <Input type="number" placeholder="Nhập giá trị giảm" min={0} />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="startDate"
          rules={[
            { required: true, message: 'Vui lòng chọn ngày bắt đầu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const endDate = getFieldValue('endDate');
                if (!value || !endDate || value.isBefore(endDate)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!'));
              }
            })
          ]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="endDate"
          rules={[
            { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue('startDate');
                if (!value || !startDate || value.isAfter(startDate)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu!'));
              }
            })
          ]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Trạng thái hoạt động" name="active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            {voucher ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherModal;
