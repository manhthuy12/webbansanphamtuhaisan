import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createNews, updateNews } from 'services/newsService';
import { uploadToCloudinary } from 'utils/uploadImage'; // Import utility function
import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE Editor
import moment from 'moment'; // Import moment để lấy ngày hiện tại

const NewsModal = ({ open, onClose, news, fetchNews }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null); // Biến lưu trữ ảnh được chọn
  const [uploading, setUploading] = useState(false); // Trạng thái đang tải ảnh
  const [content, setContent] = useState(''); // Biến lưu trữ nội dung Editor
  const [contentError, setContentError] = useState(null); // Biến lưu lỗi cho Editor

  useEffect(() => {
    if (news) {
      form.setFieldsValue({
        title: news.title,
        image: news.image
      });
      setContent(news.content); // Thiết lập nội dung từ tin tức hiện tại
    } else {
      form.resetFields(); // Clear form khi mở modal để tạo mới
      setContent(''); // Clear nội dung Editor khi tạo mới
    }
  }, [news, form]);

  // Hàm xử lý khi submit form
  const handleSubmit = async (values) => {
    if (!content) {
      setContentError('Vui lòng nhập nội dung!'); // Kiểm tra nếu nội dung rỗng
      return;
    }

    try {
      setUploading(true);

      let imageUrl = values.image;
      if (imageFile) {
        // Nếu người dùng đã chọn file ảnh mới, tiến hành upload lên Cloudinary
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const newData = {
        ...values,
        content, // Lưu nội dung từ TinyMCE Editor
        image: imageUrl, // Lưu URL ảnh vào DB
        publishedDate: news ? news.publishedDate : moment().format('YYYY-MM-DD') // Tự động lấy ngày hiện tại khi tạo mới
      };

      if (news) {
        // Cập nhật tin tức
        await updateNews(news.id, newData);
        message.success('Cập nhật tin tức thành công!');
      } else {
        // Tạo mới tin tức
        await createNews(newData);
        message.success('Tạo mới tin tức thành công!');
         // Reset file đã chọn
      }
      form.resetFields(); // Clear form khi tạo mới thành công
      setContent(''); // Reset nội dung
      setImageFile(null);
      fetchNews(); // Refresh danh sách tin tức sau khi thành công
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      message.error('Lỗi khi tạo/cập nhật tin tức!');
      console.error('Lỗi khi tạo/cập nhật tin tức:', error);
    } finally {
      setUploading(false);
    }
  };

  // Hàm xử lý khi người dùng chọn ảnh
  const handleUploadChange = ({ file }) => {
    setImageFile(file); // Lưu trữ ảnh được chọn
  };

  // Hàm xử lý khi nội dung Editor thay đổi
  const handleEditorChange = (contentValue) => {
    setContent(contentValue); // Cập nhật nội dung từ Editor
    setContentError(null); // Clear lỗi khi người dùng nhập
  };

  return (
    <Modal
      title={news ? 'Cập nhật tin tức' : 'Tạo mới tin tức'}
      visible={open}
      onCancel={onClose}
      footer={null} // Sử dụng custom footer trong form
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: '',
          image: ''
        }}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề!' },
            { max: 100, message: 'Tiêu đề không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tiêu đề tin tức" />
        </Form.Item>

        <Form.Item name="content" label="Nội dung" required>
          <Editor
            apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g" // Thay thế bằng API key của bạn
            value={content}
            onEditorChange={handleEditorChange} // Cập nhật nội dung
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
          {contentError && <p style={{ color: 'red' }}>{contentError}</p>} {/* Hiển thị thông báo lỗi dưới Editor */}
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
          rules={[{ required: !news, message: 'Vui lòng chọn hình ảnh!' }]} // Chỉ bắt buộc khi thêm mới
        >
          <Upload
            name="image"
            listType="picture"
            beforeUpload={() => false} // Ngăn tải lên ngay lập tức, sẽ xử lý trong submit
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={uploading}>
            {news ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewsModal;
