import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Table, Button, Input, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';
import * as ActionTypes from '../../redux/actionTypes';

dayjs.extend(utc)

const UserManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.users.loading);

  const users = useSelector((state) => state.users.userList);

  const blockLoading = useSelector((state) => state.users.blockLoading);

  const modalRef = React.useRef();

  const onClickBlock = React.useCallback((item) => () => {
    const isBlocked = !!item.deleted_at;

    const blockColor = isBlocked ? 'green' : undefined;

    const modal = Modal.confirm({
      maskClosable: false,
      okButtonProps: {
        danger: !isBlocked,
        style: {
          borderColor: blockColor,
          backgroundColor: blockColor,
        }
      },
      title: `Bạn có chắc chắn muốn ${isBlocked ? 'mở khóa' : 'khóa'} tài khoản ${item.email}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      onOk: () => dispatch({ type: ActionTypes.BLOCK_USER, payload: item })
    });

    modalRef.current = modal;
  }, [dispatch]);

  const onSearch = React.useCallback((text) => {

  }, []);

  const columns = [
    {
      width: 70,
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      width: 120,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'functions',
      render: (text, item) => {
        const isBlocked = !!item.deleted_at;
        const blockColor = isBlocked ? 'green' : undefined;
        return (
          <Button
            type="primary"
            danger={!isBlocked}
            style={{
              borderColor: blockColor,
              backgroundColor: blockColor,
            }}
            onClick={onClickBlock(item)}
          >
            {isBlocked ? 'Mở khóa' : 'Khóa'}
          </Button>
        )
      }
    },
  ];

  React.useEffect(() => {
    if (!modalRef.current) return;

    if (blockLoading) {
      modalRef.current.update({
        okButtonProps: {
          loading: blockLoading,
          disabled: blockLoading,
        },
        cancelButtonProps: {
          disabled: blockLoading
        }
      });
    } else {
      modalRef.current.destroy();
    }
  }, [blockLoading]);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_USERS });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Tên người dùng"
          onSearch={onSearch}
        />
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        tableLayout="fixed"
        dataSource={users}
        pagination={{ pageSize: 7 }}
      />
    </div>
  );
}

export default UserManagePage;
