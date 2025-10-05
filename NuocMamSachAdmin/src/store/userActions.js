// userActions.js
import { LOGIN_USER, LOGOUT_USER, UPDATE_USER } from './actions';

// Action để đăng nhập người dùng
export const loginUser = (userData) => {
  return {
    type: LOGIN_USER,
    payload: userData
  };
};

// Action để đăng xuất người dùng
export const logoutUser = () => {
  return {
    type: LOGOUT_USER
  };
};

// Action để cập nhật thông tin người dùng
export const updateUser = (updatedProfile) => ({
  type: UPDATE_USER,
  payload: updatedProfile
});
