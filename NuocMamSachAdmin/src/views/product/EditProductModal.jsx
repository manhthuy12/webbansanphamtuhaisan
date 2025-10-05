import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Switch, message, Upload, List, Row, Col, Select, Typography, Divider } from 'antd';
import { updateProduct } from 'services/productService';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from 'utils/uploadImage';
import { Editor } from '@tinymce/tinymce-react';
import { formatCurrency } from 'utils/formatCurrency';

const { Text, Title } = Typography;

const EditProductModal = ({ open, onClose, product, fetchProducts, categories }) => {
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm(); // Form cho biến thể
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // Hình ảnh sản phẩm
  const [variants, setVariants] = useState([]); // Danh sách biến thể
  const [description, setDescription] = useState(''); // Nội dung mô tả

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        category: product.category.id // Lưu category ID
      });

      setVariants(product.variants || []); // Gán danh sách biến thể đã có

      setFileList(
        product.images.map((url, index) => ({
          uid: index,
          name: `image-${index}`,
          status: 'done',
          url
        }))
      );

      setDescription(product.description); // Thiết lập mô tả
    }
  }, [product, form]);

  // Xử lý submit form sản phẩm
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const uploadedProductImages = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            return await uploadToCloudinary(file.originFileObj);
          }
          return file.url;
        })
      );

      // Loại bỏ ID của variants trước khi gửi lên server
      const sanitizedVariants = variants.map(({ name, price, quantity }) => ({
        name,
        price,
        quantity
      }));

      const productData = {
        ...values,
        images: uploadedProductImages, // Sử dụng các URL ảnh đã upload
        category: { id: values.category }, // Lưu category theo dạng { id: categoryId }
        variants: sanitizedVariants, // Biến thể sau khi loại bỏ ID
        description // Lưu mô tả từ TinyMCE Editor
      };

      await updateProduct(product.id, productData); // Cập nhật sản phẩm
      message.success('Cập nhật sản phẩm thành công!');
      fetchProducts(); // Refresh danh sách sản phẩm
      onClose(); // Đóng modal
    } catch (error) {
      message.error('Lỗi khi cập nhật sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Thêm biến thể mới
  const handleAddVariant = async () => {
    const variantValues = await variantForm.validateFields();

    if (variants.some((variant) => variant.name === variantValues.name)) {
      message.error('Tên biến thể không được trùng!');
      return;
    }

    const newVariant = {
      name: variantValues.name,
      price: variantValues.price,
      quantity: variantValues.quantity
    };

    setVariants((prev) => [...prev, newVariant]);
    variantForm.resetFields();
  };

  // Xóa biến thể
  const handleRemoveVariant = (name) => {
    setVariants((prev) => prev.filter((variant) => variant.name !== name));
  };

  return (
    <Modal title="Cập nhật sản phẩm" visible={open} onCancel={onClose} footer={null} width={800}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item label="Giá bán" name="salePrice" rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}>
          <InputNumber placeholder="Nhập giá bán" style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Giá gốc" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}>
          <InputNumber placeholder="Nhập giá gốc" style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Mô tả">
          <Editor
            apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g"
            value={description}
            onEditorChange={setDescription}
            init={{
              height: 300,
              menubar: false,
              plugins: ['lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen'],
              toolbar: 'undo redo | styleselect | bold italic | link image | bullist numlist'
            }}
          />
        </Form.Item>
        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
          <InputNumber placeholder="Nhập số lượng" style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Hot" name="hot" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Đang giảm giá" name="sale" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
          <Select placeholder="Chọn danh mục sản phẩm">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Thêm biến thể sản phẩm */}
        <Form.Item label="Thêm biến thể">
          <Form form={variantForm} layout="inline">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="name" rules={[{ required: true, message: 'Nhập tên biến thể!' }]}>
                  <Input placeholder="Tên biến thể" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="price" rules={[{ required: true, message: 'Nhập giá biến thể!' }]}>
                  <InputNumber placeholder="Giá biến thể" style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="quantity" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
                  <InputNumber placeholder="Số lượng" style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Button style={{ marginTop: '15px' }} type="primary" icon={<PlusOutlined />} onClick={handleAddVariant}>
              Thêm biến thể
            </Button>
          </Form>
        </Form.Item>

        {/* Danh sách biến thể */}
        <List
          header={<Title level={4}>Danh sách biến thể</Title>}
          bordered
          dataSource={variants}
          renderItem={(item) => (
            <List.Item>
              <Row style={{ width: '100%' }} align="middle">
                <Col span={18}>
                  <Text strong>{item.name}</Text>
                  <Divider type="vertical" />
                  <Text>{formatCurrency(item.price)}</Text>
                  <Divider type="vertical" />
                  <Text>Số lượng: {item.quantity}</Text>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Button type="link" icon={<DeleteOutlined />} onClick={() => handleRemoveVariant(item.name)}>
                    Xóa
                  </Button>
                </Col>
              </Row>
            </List.Item>
          )}
        />
        <Form.Item label="Hình ảnh sản phẩm" name="images">
          <Upload
            listType="picture"
            beforeUpload={() => false}
            multiple
            fileList={fileList}
            onChange={handleFileChange}
            onRemove={(file) => setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid))}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
