import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Table, Button, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';
import { formatCurrency } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';

dayjs.extend(utc)

const OrderManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.transactions.loading);

  const transactions = useSelector((state) => state.transactions.transactionList)

  const onClickDetail = React.useCallback((item) => () => {
    dispatch({ type: ActionTypes.SELECT_TRANSACTION, payload: item });
  }, [dispatch]);

  const onSearch = React.useCallback((text) => {

  }, []);

  const columns = [
    {
      width: 100,
      title: 'Đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'user_phone',
      key: 'user_phone',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => formatCurrency(`${text} VNĐ`)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => `${text}`
    },
    {
      width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')
    },
    // {
    //   width: 175,
    //   title: 'Cập nhật cuối',
    //   dataIndex: 'updated_at',
    //   key: 'updated_at',
    // },
    {
      width: 175,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'functions',
      render: (text, item) => (
        <Button type="primary" className={styles.buttonSeparator} onClick={onClickDetail(item)}>Chi tiết</Button>
      )
    },
  ];

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_TRANSACTIONS });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Mã đơn hàng"
          onSearch={onSearch}
        />
      </div>

      <Table
        rowKey="Transaction_Id"
        loading={loading}
        columns={columns}
        // tableLayout="fixed"
        dataSource={transactions}
        pagination={{ pageSize: 7 }}
      />
    </div>
  );
}
export default OrderManagePage;