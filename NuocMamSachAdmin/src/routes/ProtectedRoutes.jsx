import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const ProtectedRoutes = ({ allowedRoles }) => {
  const user = useSelector((state) => state.user.userInfo);

  if (!user) {
    // Redirect to login page if user is not logged in
    message.warning('Vui lòng đăng nhập để truy cập');
    return <Navigate to="/pages/login/login3" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user role is not allowed
    return <Navigate to="/dashboard/default" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
