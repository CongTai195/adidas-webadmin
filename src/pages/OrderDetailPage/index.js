/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Tag, Table, Select, Button } from 'antd';

import styles from './styles.module.css';
import { formatCurrency } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';
import { routes, transactionStatusColor, transactionStatusLabel } from '../../constants';

const OrderDetailPage = () => {
  const selectedTransaction = useSelector((state) => state.transactions.selectedTransaction);

  if (!selectedTransaction) {
    return <Redirect to={routes.ORDERS.path} />;
  }

  const dispatch = useDispatch();

  const updateLoading = useSelector((state) => state.transactions.updateLoading);

  const columns = [
    {
      width: 100,
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product', 'name'],
    },
    {
      width: 100,
      title: 'Size',
      dataIndex: 'size',
    },
    {
      width: 100,
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      width: 200,
      title: 'Giá',
      dataIndex: ['product', 'price'],
      render: (text) => formatCurrency(`${text} VNĐ`)
    },
  ];

  const [state, setState] = React.useState({
    status: selectedTransaction.status,
  });

  const onChangeSelect = React.useCallback((value) => {
    setState((prevState) => ({ ...prevState, status: value }));
  }, []);

  const onSubmit = React.useCallback(() => {
    const canUpdate = state.status !== selectedTransaction.status;

    if (!canUpdate) return;

    dispatch({
      type: ActionTypes.UPDATE_TRANSACTION,
      payload: {
        id: selectedTransaction.id,
        status: state.status,
      },
    });
  }, [
    dispatch,
    state.status,
    selectedTransaction.id,
    selectedTransaction.status,
  ]);

  return (
    <div className={styles.container}>
      <Card title="Chi tiết đơn hàng" className={styles.customerDetailCard}>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Mã đơn hàng:</span></div>
          <span>#{selectedTransaction.id}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Trạng thái:</span></div>
          <Select value={state.status} disabled={updateLoading} onChange={onChangeSelect}>
            {Object.keys(transactionStatusColor).map((key) => (
              <Select.Option value={+key}>
                <Tag color={transactionStatusColor[key]}>{transactionStatusLabel[key]}</Tag>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Tên khách hàng:</span></div>
          <span>{selectedTransaction.user_name}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Địa chỉ:</span></div>
          <span>{selectedTransaction.user_address}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Số điện thoại:</span></div>
          <span>{selectedTransaction.user_phone}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Email:</span></div>
          <span>{selectedTransaction.user_email}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Tổng tiền:</span></div>
          <span>{formatCurrency(`${selectedTransaction.amount} VNĐ`)}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Phương thức thanh toán:</span></div>
          <span>{selectedTransaction.payment}</span>
        </div>
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}><span>Giao hàng:</span></div>
          <span>{selectedTransaction.shipping}</span>
        </div>

        <div className={styles.submitContainer}>
          <Button
            type="primary"
            disabled={updateLoading}
            loading={updateLoading}
            onClick={onSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        tableLayout="fixed"
        dataSource={selectedTransaction.orders}
        pagination={{ pageSize: 5 }}
      />

      {/* <AppInput
        bordered
        disabled
        size="large"
        value={state.Order_Id}
        className={styles.input}
        addonBefore={<div className={styles.inputAddonBefore}>Order_Id</div>}
        onChange={onChange('Order_Id')}
      /> */}

      {/* <Button
        type="primary"
        size="large"
        className={styles.submitButton}
        onClick={onSubmit}
      >
        Cập nhật
      </Button> */}
    </div >
  );
}

export default OrderDetailPage;
