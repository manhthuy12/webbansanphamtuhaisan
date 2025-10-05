import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;

export const addReview = async ({ productId, userId, rating, content }) => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.post(
      `${API_URL}/reviews/add`,
      {
        rating,
        content,
      },
      {
        params: {
          productId,
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw new Error('Token expired or invalid'); 
    }
    console.error('Lỗi khi gửi đánh giá:', error);
    throw error;
  }
};

export const replyReview = async ({ productId, userId, parentReviewId, content }) => {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  if (!token) {
    throw new Error('No token found');
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/reviews/reply`,
      {
        content,
      },
      {
        params: {
          productId,
          userId,
          parentReviewId,
        },
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw new Error('Token expired or invalid'); 
    }
    console.error('Lỗi khi trả lời bình luận:', error);
    throw error;
  }
};
