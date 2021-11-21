import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { push } from 'connected-react-router';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Button, Input, Modal, Image } from 'antd';

import styles from './styles.module.css';
import { routes } from '../../constants';
import { formatCurrency } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';

dayjs.extend(utc)

const ProductManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.products.loading);

  const products = useSelector((state) => state.products.productList)

  const deleteLoading = useSelector((state) => state.products.deleteLoading);

  const modalRef = React.useRef();

  const onClickRemove = React.useCallback((item) => () => {
    const modal = Modal.confirm({
      maskClosable: false,
      okButtonProps: { danger: true },
      title: `Bạn có chắc chắn muốn xóa sản phẩm ${item.name}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      onOk: () => dispatch({ type: ActionTypes.DELETE_PRODUCT, payload: item })
    });

    modalRef.current = modal;
  }, [dispatch]);

  const onClickEdit = React.useCallback((item) => () => {
    // dispatch(push(routes.PRODUCT_DETAIL(item.Id).path));
    dispatch({ type: ActionTypes.SELECT_PRODUCT, payload: item });
  }, [dispatch]);

  const onSearch = React.useCallback((text) => {

  }, []);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (imageSource) => {
        let customImageSource = imageSource;

        if(!customImageSource.startsWith('http')) {
          customImageSource = `http://127.0.0.1:8000/${customImageSource}`
        }

        return <Image src={customImageSource} width={100} />;
      }
    },
    {
      width: 200,
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => formatCurrency(`${text} VNĐ`)
    },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'Description',
    //   key: 'Description',
    // },
    {
      width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      width: 200,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'functions',
      render: (text, item) => (
        <div>
          <Button type="primary" className={styles.buttonSeparator} onClick={onClickEdit(item)}>Chỉnh sửa</Button>
          <Button type="primary" danger onClick={onClickRemove(item)}>Xóa</Button>
        </div>
      )
    },
  ];

  React.useEffect(() => {
    if (!modalRef.current) return;

    if (deleteLoading) {
      modalRef.current.update({
        okButtonProps: {
          loading: deleteLoading,
          disabled: deleteLoading,
        },
        cancelButtonProps: {
          disabled: deleteLoading
        }
      });
    } else {
      modalRef.current.destroy();
    }
  }, [deleteLoading]);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_PRODUCTS });
  }, [dispatch]);

  const onClickAddProduct = React.useCallback(() => {
    dispatch(push(routes.ADD_PRODUCT.path));
  }, [dispatch]);

  const cardExtra = React.useMemo(() => (
    <div className={styles.cardExtra}>
      <Button
        type="primary"
        // shape="circle"
        icon={<AiOutlinePlus />}
        className={styles.addProductFAB}
        onClick={onClickAddProduct}
      >Thêm sản phẩm</Button>

      <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Tìm kiếm sản phẩm"
          onSearch={onSearch}
        />
      </div>
    </div>
  ), [onClickAddProduct, onSearch]);

  return (
    <div className={styles.container}>
      <Card
        title="Quản lý kho"
        extra={cardExtra}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="Id"
          loading={loading}
          columns={columns}
          dataSource={products}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
export default ProductManagePage;