import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Button, Input, Modal, Form, Select } from 'antd';

import styles from './styles.module.css';
import * as ActionTypes from '../../redux/actionTypes';

dayjs.extend(utc)

const CategoryManagePage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.categories.loading);
  const addLoading = useSelector((state) => state.categories.addLoading);
  const updateLoading = useSelector((state) => state.categories.updateLoading);
  const deleteLoading = useSelector((state) => state.categories.deleteLoading);

  const categories = useSelector((state) => state.categories.categoryList);

  const modalRef = React.useRef();

  const formRef = React.useRef();

  const onClickDelete = React.useCallback((item) => () => {
    const modal = Modal.confirm({
      maskClosable: false,
      okButtonProps: { danger: true },
      title: `Bạn có chắc chắn muốn xóa danh mục ${item.name}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      onOk: (c) => dispatch({ type: ActionTypes.DELETE_CATEGORY, payload: item })
    });

    modalRef.current = modal;
  }, [dispatch]);

  // const onSearch = React.useCallback((text) => {

  // }, []);

  const showCategoryModal = React.useCallback(async (title, actionType, initialValues = { id: null, name: '', type: null, subs: [] }) => {
    let modal;

    try {
      const values = await new Promise((resolve, reject) => {
        modal = Modal.confirm({
          title,
          onCancel: reject,
          onOk: (c) => {
            formRef.current.submit();
          },
          content: (
            <Form
              ref={formRef}
              autoComplete="off"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={initialValues}
              style={{ margin: '24px 0 -24px -38px' }}
              onFinish={resolve}
            >
              {!!initialValues.id && <Form.Item name="id" hidden />}

              <Form.Item
                label="Tên danh mục"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Danh mục cha" name="type">
                <Select disabled={!!initialValues.subs?.length} placeholder="Chọn thư mục cha">
                  {[{ id: null, name: 'Không có' }].concat(categories.filter((x) => !x.type)).map((c) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          ),
        });

        modalRef.current = modal;
      });

      dispatch({ type: actionType, payload: values });
    } catch (error) {
      modal.destroy();
    }
  }, [categories, dispatch]);

  const onClickEdit = React.useCallback((item) => async () => {
    showCategoryModal(
      'Chỉnh sửa danh mục',
      ActionTypes.UPDATE_CATEGORY,
      item,
    );
  }, [showCategoryModal]);

  const columns = [
    {
      width: 100,
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Danh mục',
      dataIndex: 'name',
    },
    {
      // width: 175,
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (created_at) => dayjs.utc(created_at || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      width: 200,
      title: 'Chức năng',
      dataIndex: 'functions',
      key: 'functions',
      render: (_, item) => {
        return (
          <div>
            <Button
              type="primary"
              className={styles.buttonSeparator}
              onClick={onClickEdit(item)}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              type="primary"
              onClick={onClickDelete(item)}
            >
              Xóa
            </Button>
          </div>
        )
      }
    },
  ];

  React.useEffect(() => {
    if (!modalRef.current) return;

    let loading = addLoading || updateLoading || deleteLoading;

    if (loading) {
      modalRef.current.update({
        okButtonProps: {
          loading,
          disabled: loading,
        },
        cancelButtonProps: {
          disabled: loading
        }
      });
    } else if (modalRef.current) {
      modalRef.current.destroy();
      modalRef.current = null;
    }
  }, [addLoading, updateLoading, deleteLoading]);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.GET_CATEGORIES });
  }, [dispatch]);

  const onClickAddCategory = React.useCallback(() => {
    showCategoryModal('Thêm danh mục', ActionTypes.ADD_CATEGORY);
  }, [showCategoryModal]);

  const cardExtra = React.useMemo(() => (
    <div className={styles.cardExtra}>
      <Button
        type="primary"
        icon={<AiOutlinePlus />}
        className={styles.addCategoryButton}
        onClick={onClickAddCategory}
      >
        Thêm danh mục
      </Button>

      {/* <div className={styles.searchContainer}>
        <Input.Search
          enterButton
          placeholder="Tìm kiếm danh mục..."
          onSearch={onSearch}
        />
      </div> */}
    </div>
  ), [onClickAddCategory]);

  return (
    <div className={styles.container}>
      <Card
        title="Quản lý danh mục sản phẩm"
        extra={cardExtra}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          tableLayout="fixed"
          dataSource={categories}
          pagination={{ pageSize: 7 }}
          expandable={{ childrenColumnName: 'subs' }}
        />
      </Card>
    </div>
  );
}

export default CategoryManagePage;
