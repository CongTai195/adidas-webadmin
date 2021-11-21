import React from 'react';
import { Card, Table } from 'antd';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import styles from './styles.module.css';
import { routes } from '../../constants';
import { formatCurrency } from '../../utils';

const OrderDetailPage = () => {
  const selectedTransaction = useSelector((state) => state.transactions.selectedTransaction);

  if(!selectedTransaction) {
    return <Redirect to={routes.ORDERS.path} />;
  }

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

  return (
    <div className={styles.container}>
      <Card title="Chi tiết đơn hàng" className={styles.customerDetailCard}>
        <p>Mã đơn hàng: #{selectedTransaction.id}</p>
        <p>Tên khách hàng: {selectedTransaction.user_name}</p>
        <p>Địa chỉ: {selectedTransaction.user_address}</p>
        <p>Số điện thoại: {selectedTransaction.user_phone}</p>
        <p>Email: {selectedTransaction.user_email}</p>
        <p>Tổng tiền: {formatCurrency(`${selectedTransaction.amount} VNĐ`)}</p>
        <p>Phương thức thanh toán: {selectedTransaction.payment}</p>
        <p>Giao hàng: {selectedTransaction.shipping}</p>
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
    </div>
  );
}

export default OrderDetailPage;
