import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { FaBox, FaTags, FaUserCircle, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

import NotFound from '../pages/NotFound';
import UserManagePage from '../pages/UserManagePage';
import OrderManagePage from '../pages/OrderManagePage';
import OrderDetailPage from '../pages/OrderDetailPage';
import CategoryManagePage from '../pages/CategoryManagePage';
// import AddCategoryPage from '../pages/AddCategoryPage';
import ProductManagePage from '../pages/ProductManagePage';
import AddProductPage from '../pages/AddProductPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import InComeManagePage from '../pages/IncomeManagePage';

import * as ActionTypes from '../redux/actionTypes';

export const routes = {
  HOME_REDIRECT: {
    path: '/',
    exact: true,
    component: <Redirect to="/users" />
  },
  USERS: {
    path: '/users',
    component: UserManagePage
  },
  ORDERS: (userId = '') => {
    let path = `/orders`;

    if (userId) {
      path = `/orders/${userId}`
    }

    return {
      path,
      component: OrderManagePage,
      defaultParam: '/:userId?'
    }
  },
  ORDER_DETAIL: {
    path: '/order/detail',
    component: OrderDetailPage
  },
  CATEGORIES: {
    path: '/categories',
    exact: true,
    component: CategoryManagePage
  },
  // ADD_CATEGORY: {
  //   path: '/products/add',
  //   component: AddProductPage
  // },
  PRODUCTS: {
    path: '/products',
    exact: true,
    component: ProductManagePage
  },
  ADD_PRODUCT: {
    path: '/products/add',
    component: AddProductPage
  },
  PRODUCT_DETAIL: {
    path: '/products/detail',
    component: ProductDetailPage
  },
  INCOME: {
    path: '/income',
    component: InComeManagePage,
  },
  NOT_FOUND: {
    path: '*',
    component: NotFound,
  }
};

export const sideMenuItems = [
  {
    title: 'Quản lý người dùng',
    path: routes.USERS.path,
    icon: <FaUserCircle />,
  },
  {
    title: 'Quản lý danh mục',
    path: routes.CATEGORIES.path,
    icon: <FaTags />,
  },
  {
    title: 'Quản lý sản phẩm',
    path: routes.PRODUCTS.path,
    icon: <FaBox />,
  },
  {
    title: 'Quản lý đơn hàng',
    path: routes.ORDERS().path,
    icon: <FaShoppingCart />,
  },
  {
    title: 'Quản lý doanh thu',
    path: routes.INCOME.path,
    icon: <FaDollarSign />,
  },
  {
    title: 'Đăng xuất',
    action: ActionTypes.LOGOUT,
    icon: <BiLogOut />,
  },
];

export const localStorageKey = {
  SIDEBAR_COLLAPSED: 'SIDEBAR_COLLAPSED',
  LOGIN_INFO: 'LOGIN_INFO',
  RECENTLY_EMAIL: 'RECENTLY_EMAIL',
};

export const responseStatus = {
  OK: 'OK', // Success
  NG: 'NG', // Failed
};

export const responseError = {
  UNAUTHENTICATED: 'Unauthenticated.',
};

export const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api-admin'
});

export const imageListSeparator = ';';

export const transactionStatus = {
  ORDER_CANCELLED: 0,
  ORDER_SUCCESS: 1,
  ORDER_DELIVERY: 1,
  ORDER_DELIVERED: 1,
}
export const transactionStatusLabel = {
  0: 'Đã hủy hoặc trả lại',
  1: 'Đặt hàng thành công',
  2: 'Đang giao hàng',
  3: 'Giao hàng thành công'
}

export const transactionStatusColor = {
  0: 'red',
  1: '#108ee9',
  2: '#f50',
  3: '#87d068'
}