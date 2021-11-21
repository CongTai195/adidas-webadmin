import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { FaBox, FaUserCircle, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

import NotFound from '../pages/NotFound';
import UserManagePage from '../pages/UserManagePage';
import OrderManagePage from '../pages/OrderManagePage';
import OrderDetailPage from '../pages/OrderDetailPage';
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
  ORDERS: {
    path: '/orders',
    exact: true,
    component: OrderManagePage
  },
  ORDER_DETAIL: {
    path: '/orders/detail',
    component: OrderDetailPage
  },
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
    title: 'Quản lý kho',
    path: routes.PRODUCTS.path,
    icon: <FaBox />,
  },
  {
    title: 'Quản lý đơn hàng',
    path: routes.ORDERS.path,
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
};

export const responseStatus = {
  OK: 'OK', // Success
  NG: 'NG', // Failed
};

export const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api-admin'
});