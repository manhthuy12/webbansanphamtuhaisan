import axios from 'axios';

// Hàm upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Lấy từ biến môi trường
  formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); // Lấy từ biến môi trường

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.url; // Trả về URL của ảnh sau khi upload
  } catch (error) {
    throw new Error('Lỗi khi tải ảnh lên Cloudinary');
  }
};
