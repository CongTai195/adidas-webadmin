import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Table, Button, Input, Modal, Image } from 'antd';
import { Line } from '@ant-design/charts';

import styles from './styles.module.css';
import { routes } from '../../constants';
import * as ActionTypes from '../../redux/actionTypes';

// export const products = Array.from({ length: 10 }).fill().map((_, index) => {
//   const productNumber = index + 1;
//   return {
//     Id: `${productNumber}`,
//     Name: `Product #${productNumber}`,
//     Image: `Product #${productNumber} image`,
//     Product_Sold: 50,
//   };
// });

export const income = Array.from({ length: 10 }).fill().map((_, index) => {
    const transaction_id = index + 1;
    return {
      Transaction_Id: `${transaction_id}`,
      Date: '20:32 15/11/2021',
      Amount: 500,
    };
  });

const InComeManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.products.loading);

  const products = useSelector((state) => state.products.productList);

  const [state, setState] = React.useState({
    // products,
    income
  });


  const onSearch = React.useCallback((text) => {

  }, []);

  const columns2 = [
    {
      title: 'Transaction_Id',
      dataIndex: 'Transaction_Id',
      key: 'Transaction_Id',
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
    },

  ];

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (imageSource) => <Image src={imageSource} width={100} />
    },
    {
        title: 'Số Lượng',
        dataIndex: ['detail_products', 'quantity'],
        // key: 'quantity',
      },

  ];

  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  //return <Line {...config} />;

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_PRODUCTS });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Tìm kiếm sản phẩm"
          onSearch={onSearch}
        />
      </div>

      <Table
        rowKey="Id"
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 4 }}
      />

     <Table
        rowKey="Id"
        columns={columns2}
        dataSource={state.income}
        pagination={{ pageSize: 4 }}
      />
      <Line {...config} />;
    </div>
    
  );
}
export default InComeManagePage;