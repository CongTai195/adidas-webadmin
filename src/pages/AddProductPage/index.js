import React from 'react';
import {
  Card,
  Form,
  Modal,
  // Table,
  Input,
  Button,
  Upload,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
// import { FaTrashAlt } from 'react-icons/fa';


import AppInput from '../../components/AppInput';
// import EditableCell from '../../components/EditableCell';

import styles from './styles.module.css';
import { formatCurrency, readFile } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';

dayjs.extend(utc)

const maxProductImage = 1;

const maxProductImageList = 5;

const AddProductPage = () => {
  const dispatch = useDispatch();

  const addLoading = useSelector((state) => state.products.addLoading);

  const [state, setState] = React.useState({
    image: null,
    imageList: [],
  });

  const onClickRemoveSize = React.useCallback((item) => () => {
    Modal.confirm({
      maskClosable: true,
      okButtonProps: { danger: true },
      title: `Are you sure want to delete product #${item.Id}?`,
      onOk: () => {
        setState((prevState) => {
          const products = JSON.parse(JSON.stringify(prevState.product.products));

          const itemIndex = products.findIndex((x) => x.Id === item.Id);

          products.splice(itemIndex, 1);

          return {
            ...prevState,
            products,
          }
        });
      }
    });
  }, []);

  const onClickUpdateSize = React.useCallback((item) => () => {
  }, []);

  const productDetailColumns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Kích cỡ',
      dataIndex: 'size',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (text) => dayjs.utc(text || undefined).format('HH:mm DD/MM/YYYY')
    },
    {
      title: 'Chức năng',
      key: 'functions',
      render: (text, item) => (
        <div>
          <Button type="primary" className={styles.buttonSeparator} onClick={onClickUpdateSize(item)}>Cập nhật</Button>
          <Button type="primary" danger onClick={onClickRemoveSize(item)}>Xóa</Button>
        </div>
      )
    },
  ];

  const mergedColumns = productDetailColumns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: true,
        inputType: col.inputType || 'text',
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  const onFinish = React.useCallback((values) => {
    dispatch({ type: ActionTypes.ADD_PRODUCT, payload: values });
  }, [dispatch]);

  const renderFormItem = React.useCallback((item) => {
    const sharedProps = {
      key: item.name,
      name: item.name,
      label: item.label,
      rules: item.rules,
      wrapperCol: item.wrapperCol,
    };

    if (item.valuePropName) {
      sharedProps.valuePropName = item.valuePropName;
    }

    if (item.getValueFromEvent) {
      sharedProps.getValueFromEvent = item.getValueFromEvent;
    }

    return (
      <Form.Item
        {...sharedProps}
      >
        {item.component || <AppInput disabled={addLoading} />}
      </Form.Item>
    )
  }, [addLoading]);

  const onBeforeUpload = React.useCallback(() => false, []);

  const setImageBase64 = React.useCallback(async (fieldName, file) => {
    try {
      const response = await readFile(file);

      setState((prevState) => ({
        ...prevState,
        [fieldName]: {
          ...file,
          base64: response.result,
        },
      }))
    } catch (error) {

    }
  }, []);

  const onUploadChange = React.useCallback((e) => {
    setImageBase64('image', e.file);

    return e.fileList;
  }, [setImageBase64]);

  const onUploadImageListChange = React.useCallback((e) => {
    setState((prevState) => ({ ...prevState, imageList: e.fileList }));
    return e.fileList;
  }, []);

  const formItems = React.useMemo(() => [
    {
      name: 'name',
      label: 'Tên sản phẩm',
      rules: [{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]
    },
    {
      name: 'price',
      label: 'Giá sản phẩm',
      rules: [
        { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
        { type: 'number', message: 'Giá sản phẩm không hợp lệ!' },
      ],
      component: (
        <InputNumber
          disabled={addLoading}
          className={styles.priceInput}
          parser={value => {
            // const valueWithoutCurrency = value.replace(' VNĐ', '');
            // const valueWithoutSeparator = valueWithoutCurrency.replace(/,/g, '').trim();
            return value.replace(/\D/g, '').trim();
          }}
          formatter={(value) => formatCurrency(`${value} VNĐ`)} />
      )
    },
    {
      name: 'image',
      valuePropName: 'fileList',
      label: 'Hình ảnh đại diện',
      getValueFromEvent: onUploadChange,
      rules: [{ min: 1, type: 'array', message: 'Vui lòng chọn hình ảnh!' }],
      component: (
        <Upload
          accept="image/*"
          listType="picture"
          disabled={addLoading}
          showUploadList={false}
          maxCount={maxProductImage}
          className={`avatar-uploader ${styles.uploadButton}`}
          beforeUpload={onBeforeUpload}
        >
          {state.image
            ? <img src={state.image.base64} alt="avatar" className={styles.uploadImage} />
            : (
              <div className={styles.uploadButtonPlaceholder}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            )}
        </Upload>
      )
    },
    {
      name: 'imageList',
      valuePropName: 'fileList',
      label: 'Hình ảnh chi tiết',
      getValueFromEvent: onUploadImageListChange,
      rules: [{ min: 1, type: 'array', message: 'Vui lòng chọn hình ảnh!' }],
      component: (
        <Upload
          accept="image/*"
          disabled={addLoading}
          listType="picture-card"
          className="avatar-uploader"
          maxCount={maxProductImageList}
          multiple={state.imageList.length < maxProductImageList - 1}
          beforeUpload={onBeforeUpload}
        >
          {state.imageList.length < maxProductImageList && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          )}
        </Upload>
      )
    },
    {
      name: 'specifications',
      label: 'Chi tiết sản phẩm',
      rules: [
        { required: true, message: 'Vui lòng nhập chi tiết sản phẩm.' },
      ],
      component: <Input.TextArea disabled={addLoading} rows={3} />
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [
        { required: true, message: 'Vui lòng nhập mô tả cho sản phẩm.' },
        { max: 1000, message: 'Mô tả quá dài!' },
      ],
      component: <Input.TextArea disabled={addLoading} rows={8} />
    },
    {
      name: 'submit',
      wrapperCol: {
        offset: 5,
        span: 10,
      },
      component: (
        <Button
          type="primary"
          htmlType="submit"
          loading={addLoading}
          disabled={addLoading}
        >
          Cập nhật
        </Button>
      )
    },
  ], [
    onBeforeUpload,
    onUploadChange,
    onUploadImageListChange,
    addLoading,
    state.image,
    state.imageList.length,
  ]);

  return (
    <div className={styles.container}>
      <Card title="Thêm sản phẩm">
        <Form
          name="product-form"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
          initialValues={{
            name: '',
            price: 0,
            image: [],
            imageList: [],
            specifications: '',
            description: '',
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {formItems.map(renderFormItem)}
        </Form>
      </Card>

      {/* <Card title="Size của sản phẩm:" className={styles.tableContainer}>
        <Form
          name="size-table-form"
          onFinish={onSizeTableFormFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={state.selectedProduct.detail_products}
        >
          <Table
            rowKey="Id"
            columns={mergedColumns}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            tableLayout="fixed"
            dataSource={state.selectedProduct.detail_products}
            pagination={{ pageSize: 5 }}
          />
        </Form>
      </Card> */}
    </div>
  );
}

export default AddProductPage;
