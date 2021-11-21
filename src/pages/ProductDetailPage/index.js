import React from 'react';
import {
  Card,
  Form,
  Modal,
  Table,
  Input,
  Button,
  Upload,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Redirect } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';


import AppInput from '../../components/AppInput';
import EditableCell from '../../components/EditableCell';

import styles from './styles.module.css';
import { routes } from '../../constants';
import { formatCurrency, readFile } from '../../utils';
import * as ActionTypes from '../../redux/actionTypes';

dayjs.extend(utc)

const ProductDetailPage = () => {
  const dispatch = useDispatch();

  const selectedProduct = useSelector((state) => state.products.selectedProduct);

  const [state, setState] = React.useState({
    imageList: [],
    selectedProduct: JSON.parse(JSON.stringify(selectedProduct))
  });

  // const onChange = React.useCallback((fieldName) => (e) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     [fieldName]: e.target.value,
  //   }));
  // }, []);

  // const onSubmit = React.useCallback(() => {

  // }, []);

  const onClickRemoveSize = React.useCallback((item) => () => {
    Modal.confirm({
      maskClosable: true,
      okButtonProps: { danger: true },
      title: `Are you sure want to delete product #${item.Id}?`,
      onOk: () => {
        setState((prevState) => {
          const products = JSON.parse(JSON.stringify(prevState.selectedProduct.products));

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
    console.log('values > ', values);
    // setState((prevState) => ({ ...prevState, ...values }))
    dispatch({ type: ActionTypes.UPDATE_PRODUCT, payload: values });
  }, [dispatch]);

  const renderFormItem = React.useCallback((item) => (
    <Form.Item
      key={item.name}
      name={item.name}
      label={item.label}
      rules={item.rules}
      wrapperCol={item.wrapperCol}
    >
      {item.component || <AppInput />}
    </Form.Item>
  ), []);

  const onBeforeUpload = React.useCallback((file) => {
    console.log('onUploadChange > ', file);
    // setState(prevState => ({
    //   imageList: [...prevState.imageList, file],
    // }));
    return false;

  }, []);

  const onUploadChange = React.useCallback((e) => {
    console.log('onUploadChange > ', e);
  }, []);

  const onUploadImageListChange = React.useCallback(async (e) => {
    try {
      const response = await readFile(e.file);

      setState((prevState) => ({
        ...prevState,
        imageList: prevState.imageList.concat([{ ...e.file, base64: response.result }]),
      }));
    } catch (error) {
      alert(error);
    }
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
      label: 'Hình ảnh',
      // rules: [{ required: true, message: 'Vui lòng nhập hình ảnh!' }]
      component: (
        <Upload
          accept="image/*"
          showUploadList={false}
          listType="picture"
          className={styles.uploadButton}
          onChange={onUploadChange}
          beforeUpload={onBeforeUpload}
        >
          <img src={state.selectedProduct.image} alt="avatar" className={styles.uploadImage} />
        </Upload>
      )
    },
    {
      name: 'imageList',
      label: 'Hình ảnh chi tiết',
      rules: [{ required: true, message: 'Vui lòng chọn hình ảnh!' }],
      component: (
        <>
          <Upload
            maxCount={5}
            accept="image/*"
            showUploadList={false}
            listType="picture"
            fileList={state.imageList}
            className={`avatar-uploader ${styles.uploadButton}`}
            onChange={onUploadImageListChange}
            beforeUpload={onBeforeUpload}
          />
        </>
      )
    },
    {
      name: 'specifications',
      label: 'Thông tin chi tiết',
      rules: [{ required: true, message: 'Vui lòng nhập thông tin chi tiết!' }],
      component: (
        <Input.TextArea rows={3} />
      )
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [
        { required: true, message: 'Vui lòng nhập mô tả cho sản phẩm!' },
        { max: 1000, message: 'Mô tả quá dài!' }
      ],
      component: (
        <Input.TextArea rows={5} />
      )
    },
    {
      wrapperCol: {
        offset: 5,
        span: 10,
      },
      component: (
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      )
    },
  ], [onBeforeUpload, onUploadChange, state.selectedProduct.image]);

  const onSizeTableFormFinish = React.useCallback((values) => {
    console.log("🚀 ~ file: index.js ~ line 186 ~ onSizeTableFormFinish ~ values", values)
  }, []);

  const onClickRemoveProduct = React.useCallback(() => {
    Modal.confirm({
      maskClosable: true,
      okButtonProps: { danger: true },
      title: `Are you sure want to delete product ${state.selectedProduct.name}?`,
      onOk: () => {

      }
    });
  }, [state.selectedProduct.name]);

  if (!selectedProduct) {
    return <Redirect to={routes.PRODUCTS.path} />;
  }

  return (
    <div className={styles.container}>
      <Card
        title={`Sản phẩm: ${state.selectedProduct.name}`}
        extra={<Button danger icon={<FaTrashAlt />} onClick={onClickRemoveProduct} />}
      >
        <Form
          name="product-form"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
          initialValues={state.selectedProduct}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {formItems.map(renderFormItem)}
        </Form>
      </Card>

      <Card title="Size của sản phẩm:" className={styles.tableContainer}>
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
      </Card>
    </div>
  );
}

export default ProductDetailPage;
