// assets
import {
  IconDashboard,
  IconList,
  IconNews,
  IconShoppingCart,
  IconPackage,
  IconDiscount,
  IconUsers,
  IconMessageCircle,
  IconTools,
  IconUserCheck // Import thêm biểu tượng mới cho Quản lý tài khoản
} from '@tabler/icons-react';

// constant
const icons = {
  IconDashboard,
  IconList,
  IconNews,
  IconShoppingCart,
  IconPackage,
  IconDiscount,
  IconUsers,
  IconMessageCircle,
  IconTools,
  IconUserCheck
};

// Lấy thông tin user từ localStorage
const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null; // Kiểm tra nếu có user thì lấy ra, nếu không thì để null

// Cấu hình menu đầy đủ cho admin
const adminMenu = [
  {
    id: 'default',
    title: 'Thống kê doanh thu',
    type: 'item',
    url: '/dashboard/default',
    icon: icons.IconDashboard,
    breadcrumbs: false
  },
  {
    id: 'order-management',
    title: 'Quản lý đơn hàng',
    type: 'item',
    url: '/order-management',
    icon: icons.IconShoppingCart,
    breadcrumbs: false
  },
  {
    id: 'pos-sale',
    title: 'Bán hàng tại quầy',
    type: 'item',
    url: '/pos-sale',
    icon: icons.IconShoppingCart,
    breadcrumbs: false
  },
  {
    id: 'category-management',
    title: 'Quản lý danh mục',
    type: 'item',
    url: '/category-management',
    icon: icons.IconList,
    breadcrumbs: false
  },
  {
    id: 'product-management',
    title: 'Quản lý sản phẩm',
    type: 'item',
    url: '/product-management',
    icon: icons.IconPackage,
    breadcrumbs: false
  },
  {
    id: 'promotion-management',
    title: 'Quản lý khuyến mãi',
    type: 'item',
    url: '/promotion-management',
    icon: icons.IconDiscount,
    breadcrumbs: false
  },
  {
    id: 'news-management',
    title: 'Quản lý tin tức',
    type: 'item',
    url: '/news-management',
    icon: icons.IconNews,
    breadcrumbs: false
  },
  {
    id: 'user-management',
    title: 'Quản lý người dùng',
    type: 'item',
    url: '/user-management',
    icon: icons.IconUsers,
    breadcrumbs: false
  },
  {
    id: 'account-management',
    title: 'Quản lý tài khoản',
    type: 'item',
    url: '/account-management',
    icon: icons.IconUserCheck,
    breadcrumbs: false
  },
  {
    id: 'chat-support',
    title: 'Chat tư vấn',
    type: 'item',
    url: '/chat-support',
    icon: icons.IconMessageCircle,
    breadcrumbs: false
  }
];

// Cấu hình menu cho user thông thường
const userMenu = [
  {
    id: 'default',
    title: 'Thống kê doanh thu',
    type: 'item',
    url: '/dashboard/default',
    icon: icons.IconDashboard,
    breadcrumbs: false
  },
  {
    id: 'order-management',
    title: 'Quản lý đơn hàng',
    type: 'item',
    url: '/order-management',
    icon: icons.IconShoppingCart,
    breadcrumbs: false
  },
  {
    id: 'pos-sale',
    title: 'Bán hàng tại quầy',
    type: 'item',
    url: '/pos-sale',
    icon: icons.IconShoppingCart,
    breadcrumbs: false
  },
  {
    id: 'category-management',
    title: 'Quản lý danh mục',
    type: 'item',
    url: '/category-management',
    icon: icons.IconList,
    breadcrumbs: false
  },
  {
    id: 'product-management',
    title: 'Quản lý sản phẩm',
    type: 'item',
    url: '/product-management',
    icon: icons.IconPackage,
    breadcrumbs: false
  },
  {
    id: 'promotion-management',
    title: 'Quản lý khuyến mãi',
    type: 'item',
    url: '/promotion-management',
    icon: icons.IconDiscount,
    breadcrumbs: false
  },
  {
    id: 'news-management',
    title: 'Quản lý tin tức',
    type: 'item',
    url: '/news-management',
    icon: icons.IconNews,
    breadcrumbs: false
  },
  {
    id: 'chat-support',
    title: 'Chat tư vấn',
    type: 'item',
    url: '/chat-support',
    icon: icons.IconMessageCircle,
    breadcrumbs: false
  }
];

// Nếu bạn dùng cấu trúc dạng group cho dashboard (admin)
const dashboard = {
  id: 'dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Thống kê doanh thu',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'order-management',
      title: 'Quản lý đơn hàng',
      type: 'item',
      url: '/order-management',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: 'pos-sale',
      title: 'Bán hàng tại quầy',
      type: 'item',
      url: '/pos-sale',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: 'category-management',
      title: 'Quản lý danh mục',
      type: 'item',
      url: '/category-management',
      icon: icons.IconList,
      breadcrumbs: false
    },
    {
      id: 'product-management',
      title: 'Quản lý sản phẩm',
      type: 'item',
      url: '/product-management',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'promotion-management',
      title: 'Quản lý khuyến mãi',
      type: 'item',
      url: '/promotion-management',
      icon: icons.IconDiscount,
      breadcrumbs: false
    },
    {
      id: 'news-management',
      title: 'Quản lý tin tức',
      type: 'item',
      url: '/news-management',
      icon: icons.IconNews,
      breadcrumbs: false
    },
    {
      id: 'user-management',
      title: 'Quản lý người dùng',
      type: 'item',
      url: '/user-management',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'account-management',
      title: 'Quản lý tài khoản',
      type: 'item',
      url: '/account-management',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    {
      id: 'chat-support',
      title: 'Chat tư vấn',
      type: 'item',
      url: '/chat-support',
      icon: icons.IconMessageCircle,
      breadcrumbs: false
    }
  ]
};

export { adminMenu, userMenu };
export default dashboard;
