import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createAccessory, updateAccessory } from 'services/accessoryService'; // Import API
import { getAllProducts } from 'services/productService'; // Import API sản phẩm
import { uploadToCloudinary } from 'utils/uploadImage'; // Upload ảnh lên Cloudinary

const { Option } = Select;

const AccessoryModal = ({ open, onClose, accessory, fetchAccessories }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm từ API
  const [fileList, setFileList] = useState([]); // Lưu file ảnh

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getAllProducts('', '', 0, 100); // Lấy tất cả sản phẩm
        setProducts(productData.content);
      } catch (error) {
        message.error('Lỗi khi tải danh sách sản phẩm!');
      }
    };

    fetchData();

    if (accessory) {
      form.setFieldsValue({
        ...accessory,
        product: accessory.product.id // Đặt product theo ID
      });
      setFileList(
        accessory.image
          ? [
              {
                uid: '-1',
                name: 'image',
                status: 'done',
                url: accessory.image
              }
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [accessory, form]);

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

      const accessoryData = {
        ...values,
        image: imageUrl, // Gán link ảnh sau khi upload
        product: { id: values.product } // Lưu product ID
      };

      if (accessory) {
        await updateAccessory(accessory.id, accessoryData);
        message.success('Cập nhật phụ kiện thành công!');
      } else {
        await createAccessory(accessoryData);
        message.success('Tạo mới phụ kiện thành công!');
      }

      fetchAccessories(); // Refresh danh sách phụ kiện
      onClose(); // Đóng modal
    } catch (error) {
      message.error('Lỗi khi lưu phụ kiện!');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      title={accessory ? 'Chỉnh sửa phụ kiện' : 'Thêm phụ kiện mới'}
      visible={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên phụ kiện" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên phụ kiện!' }]}>
          <Input placeholder="Nhập tên phụ kiện" />
        </Form.Item>

        <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
          <InputNumber placeholder="Nhập giá" style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Số lượng tồn" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
          <InputNumber placeholder="Nhập số lượng" style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Sản phẩm liên kết" name="product" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}>
          <Select placeholder="Chọn sản phẩm">
            {products.map((product) => (
              <Option key={product.id} value={product.id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Hình ảnh" name="image">
          <Upload
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
            onRemove={() => setFileList([])}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {accessory ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccessoryModal;
