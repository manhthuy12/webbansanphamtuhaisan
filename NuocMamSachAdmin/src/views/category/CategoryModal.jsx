import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCategory, updateCategory } from 'services/categoryService';
import { uploadToCloudinary } from 'utils/uploadImage'; // Thêm hàm upload ảnh

const CategoryModal = ({ open, onClose, category, fetchCategories }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // State quản lý file ảnh
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description
      });

      setFileList(
        category.image
          ? [
              {
                uid: '-1',
                name: 'image',
                status: 'done',
                url: category.image
              }
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [category, form]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          imageUrl = await uploadToCloudinary(fileList[0].originFileObj);
        } else {
          imageUrl = fileList[0].url;
        }
      }

      const categoryData = {
        ...values,
        image: imageUrl // Gán link ảnh sau khi upload
      };

      if (category) {
        await updateCategory(category.id, categoryData);
        message.success('Cập nhật danh mục thành công!');
      } else {
        await createCategory(categoryData);
        message.success('Tạo mới danh mục thành công!');
        form.resetFields(); // Xóa form sau khi tạo mới thành công
        setFileList(null);
      }
      fetchCategories(); // Refresh danh mục sau khi thành công
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      message.error('Lỗi khi tạo/cập nhật danh mục!');
      console.error('Lỗi khi tạo/cập nhật danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={category ? 'Cập nhật danh mục' : 'Tạo mới danh mục'}
      visible={open}
      onCancel={onClose}
      footer={null} // Sử dụng custom footer trong form
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          description: ''
        }}
      >
        <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea placeholder="Nhập mô tả danh mục" rows={4} />
        </Form.Item>

        <Form.Item label="Hình ảnh" name="image">
          <Upload
            listType="picture"
            beforeUpload={() => false} // Không upload trực tiếp
            fileList={fileList}
            onChange={handleFileChange}
            onRemove={() => setFileList([])}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {category ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
