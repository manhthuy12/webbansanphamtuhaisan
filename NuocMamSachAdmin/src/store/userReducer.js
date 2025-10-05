// userReducer.js

import { LOGIN_USER, LOGOUT_USER, UPDATE_USER } from "./actions";

// Trạng thái ban đầu, không có người dùng nào được đăng nhập
const initialState = {
  isAuthenticated: false,
  userInfo: null, // Chứa thông tin người dùng như username, email, token, v.v.
};

// userReducer để xử lý login và logout
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true, // Đánh dấu là người dùng đã đăng nhập
        userInfo: action.payload, // Lưu thông tin người dùng
      };
    case UPDATE_USER:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          profile: { ...state.userInfo.profile, ...action.payload },
        },
      };
    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false, // Đánh dấu là người dùng đã đăng xuất
        userInfo: null, // Xóa thông tin người dùng
      };

    default:
      return state;
  }
};

export default userReducer;
