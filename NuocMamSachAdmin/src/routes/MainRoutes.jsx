import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoutes from './ProtectedRoutes';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// Management routing
const CategoryManagement = Loadable(lazy(() => import('views/category')));
const NewsManagement = Loadable(lazy(() => import('views/new')));
const OrderManagement = Loadable(lazy(() => import('views/order')));
const ProductManagement = Loadable(lazy(() => import('views/product')));
const PromotionManagement = Loadable(lazy(() => import('views/voucher')));
const UserManagement = Loadable(lazy(() => import('views/profile')));
const AccountManagement = Loadable(lazy(() => import('views/account')));
const ChatSupport = Loadable(lazy(() => import('views/sample-page')));
const AccessoryManagement = Loadable(lazy(() => import('views/accessory')));
const PosManagement = Loadable(lazy(() => import('views/pos/POSPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoutes allowedRoles={['ADMIN', 'STAFF']} />, // General access for STAFF and ADMIN
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard/default',
          element: <DashboardDefault />
        },
        {
          path: 'order-management',
          element: <OrderManagement />
        },
        {
          path: 'category-management',
          element: <CategoryManagement />
        },
        {
          path: 'product-management',
          element: <ProductManagement />
        },
        {
          path: 'accessory-management',
          element: <AccessoryManagement />
        },
        {
          path: 'promotion-management',
          element: <PromotionManagement />
        },
         {
          path: 'pos-sale',
          element: <PosManagement />
        },
        {
          path: 'news-management',
          element: <NewsManagement />
        },
        {
          path: 'chat-support',
          element: <ChatSupport />
        }
      ]
    },
    // Routes accessible only by ADMIN
    {
      path: '/',
      element: <ProtectedRoutes allowedRoles={['ADMIN']} />,
      children: [
        {
          path: 'user-management',
          element: <UserManagement />
        },
        {
          path: 'account-management',
          element: <AccountManagement />
        }
      ]
    }
  ]
};

export default MainRoutes;
