import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, InputNumber, Switch, Select, message, Upload } from 'antd';
import { createProduct, updateProduct, getAllAccessories } from 'services/productService';
import { UploadOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from 'utils/uploadImage'; // Utility function để upload ảnh
import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE Editor

const { TextArea } = Input;
const { Option } = Select;

const ProductModal = ({ open, onClose, product, fetchProducts, categories }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accessories, setAccessories] = useState([]); // Danh sách phụ kiện từ API
  const [selectedAccessories, setSelectedAccessories] = useState([]); // Phụ kiện được chọn
  const [fileList, setFileList] = useState([]); // Các file ảnh đã chọn (nhưng chưa upload)
  const [uploading, setUploading] = useState(false); // Trạng thái upload ảnh
  const [description, setDescription] = useState(''); // Nội dung mô tả
  const [contentError, setContentError] = useState(null); // Lỗi cho mô tả

  // Fetch danh sách phụ kiện từ API khi modal mở
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessoryResponse = await getAllAccessories();
        setAccessories(accessoryResponse.content);
      } catch (error) {
        message.error('Lỗi khi lấy danh sách phụ kiện!');
      }
    };

    fetchData();

    if (product) {
      // Nếu có sản phẩm (edit), thiết lập dữ liệu vào form
      form.setFieldsValue({
        ...product,
        category: product.category.id, // Lưu category ID
        accessories: product.accessories.map((acc) => acc.id) // Đặt phụ kiện được chọn theo ID
      });
      setSelectedAccessories(product.accessories); // Phụ kiện đầy đủ
      setFileList(
        product.images.map((url, index) => ({
          uid: index,
          name: `image-${index}`,
          status: 'done',
          url
        }))
      );
      setDescription(product.description); // Thiết lập mô tả
    } else {
      form.resetFields(); // Nếu tạo mới, reset form
      setFileList([]); // Reset fileList
      setDescription(''); // Reset mô tả
    }
  }, [product, form]);

  // Xử lý upload khi nhấn submit
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Upload các file trong fileList và lấy URL trả về
      const uploadedImages = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            // Chỉ upload nếu là file mới
            return await uploadToCloudinary(file.originFileObj);
          }
          return file.url; // Nếu là ảnh đã tồn tại (edit), lấy URL có sẵn
        })
      );

      const productData = {
        ...values,
        images: uploadedImages, // Sử dụng các URL ảnh đã upload
        category: { id: values.category }, // Lưu category theo dạng { id: categoryId }
        accessories: selectedAccessories.map((accId) => {
          const accessory = accessories.find((acc) => acc.id === accId);
          return {
            name: accessory.name,
            price: accessory.price,
            quantity: accessory.quantity,
            image: accessory.image
          };
        }), // Lưu phụ kiện theo định dạng đầy đủ
        description // Lưu mô tả từ TinyMCE Editor
      };

      if (product) {
        // Cập nhật sản phẩm
        await updateProduct(product.id, productData);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        // Tạo mới sản phẩm
        await createProduct(productData);
        message.success('Tạo mới sản phẩm thành công!');
      }

      fetchProducts(); // Refresh danh sách sản phẩm
      onClose(); // Đóng modal
    } catch (error) {
      message.error('Lỗi khi tạo/cập nhật sản phẩm!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn file (thêm file vào fileList)
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Xử lý khi thay đổi nội dung của TinyMCE Editor
  const handleEditorChange = (content) => {
    setDescription(content);
    if (contentError) setContentError(null); // Clear lỗi nếu người dùng nhập
  };

  return (
    <Modal title={product ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm'} visible={open} onCancel={onClose} footer={null} width={800}>
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

        <Form.Item label="Mô tả" required>
          <Editor
            apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g" // Thay thế bằng API key của bạn
            value={description}
            onEditorChange={setDescription}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | styleselect | bold italic | link image | bullist numlist'
            }}
          />
          {contentError && <p style={{ color: 'red' }}>{contentError}</p>}
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
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Phụ kiện" name="accessories">
          <Select
            mode="multiple"
            placeholder="Chọn phụ kiện"
            value={selectedAccessories.map((acc) => acc.id)}
            onChange={setSelectedAccessories}
          >
            {accessories.map((acc) => (
              <Option key={acc.id} value={acc.id}>
                {acc.name} - {acc.price.toLocaleString()} VND
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Hình ảnh" name="images">
          <Upload
            listType="picture"
            beforeUpload={() => false} // Ngăn upload ngay lập tức
            multiple
            fileList={fileList}
            onChange={handleFileChange} // Cập nhật fileList khi người dùng chọn file
            onRemove={(file) => {
              setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid)); // Xóa ảnh khỏi fileList
            }}
          >
            {fileList.length >= 8 ? null : (
              <Button icon={<UploadOutlined />} loading={uploading}>
                Chọn hình ảnh
              </Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {product ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
