/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  Card,
  Form,
  Modal,
  Input,
  Button,
  Upload,
  TreeSelect,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Redirect } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import AppInput from '../../components/AppInput';

import styles from './styles.module.css';
import { imageListSeparator, routes } from '../../constants';
import * as ActionTypes from '../../redux/actionTypes';
import { maxProductImage, maxProductImageList } from '../AddProductPage';
import { formatCurrency, getFormatImageSource, getImageListByString, readFile } from '../../utils';

dayjs.extend(utc)

const ProductDetailPage = () => {
  const dispatch = useDispatch();

  const selectedProduct = useSelector((state) => state.products.selectedProduct);

  if (!selectedProduct) {
    return <Redirect to={routes.PRODUCTS.path} />;
  }

  const categories = useSelector((state) => state.categories.categoryList);

  const deleteLoading = useSelector((state) => state.products.deleteLoading);

  const [state, setState] = React.useState(() => {
    const clonedSelectedProduct = JSON.parse(JSON.stringify(selectedProduct));

    const imageList = getImageListByString(clonedSelectedProduct.image_list, imageListSeparator, false).map((url) => ({
      url: getFormatImageSource(url),
      originUrl: url,
    }));

    return {
      imageList,
      selectedProduct: clonedSelectedProduct,
      image: getFormatImageSource(clonedSelectedProduct.image),
    };
  });

  const modalRef = React.useRef();

  const onFinish = React.useCallback(async (values) => {
    dispatch({ type: ActionTypes.UPDATE_PRODUCT, payload: values });
  }, [dispatch]);

  const renderFormItem = React.useCallback((item) => {
    if (item.formItem) return item.formItem;

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
        {item.component || <AppInput />}
      </Form.Item>
    )
  }, []);

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

  const renderCategoryItem = React.useCallback((item) => {
    let childrens = [];

    if (item.subs) {
      childrens = Object.values(item.subs).map((item) => (
        <TreeSelect.TreeNode
          key={item.id}
          value={item.id}
          title={item.name}
        />
      ));
    }

    return (
      <TreeSelect.TreeNode
        key={item.id}
        value={item.id}
        title={item.name}
      >
        {childrens}
      </TreeSelect.TreeNode>
    );
  }, []);

  const formItems = React.useMemo(() => [
    {
      name: 'name',
      label: 'T??n s???n ph???m',
      rules: [{ required: true, message: 'Vui l??ng nh???p t??n s???n ph???m!' }]
    },
    {
      name: 'price',
      label: 'Gi?? s???n ph???m',
      rules: [
        { required: true, message: 'Vui l??ng nh???p gi?? s???n ph???m!' },
        { type: 'number', message: 'Gi?? s???n ph???m kh??ng h???p l???!' },
      ],
      component: (
        <InputNumber
          className={styles.priceInput}
          parser={value => {
            // const valueWithoutCurrency = value.replace(' VN??', '');
            // const valueWithoutSeparator = valueWithoutCurrency.replace(/,/g, '').trim();
            return value.replace(/\D/g, '').trim();
          }}
          formatter={(value) => formatCurrency(`${value} VN??`)} />
      )
    },
    {
      formItem: (
        <Form.List key="sizes" name="sizes">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={index === 0 ? 'Sizes' : ' '}
                >
                  <Form.Item
                    name={[index, 'size']}
                    rules={[
                      {
                        required: true,
                        message: "Vui l??ng ??i???n size.",
                      },
                    ]}
                    noStyle
                  >
                    <InputNumber placeholder="Size" style={{ width: '45%', marginRight: '2.5%' }} />
                  </Form.Item>
                  <Form.Item
                    name={[index, 'quantity']}
                    rules={[
                      {
                        required: true,
                        message: "Vui l??ng ??i???n s??? l?????ng",
                      },
                    ]}
                    noStyle
                  >
                    <InputNumber placeholder="S??? l?????ng" style={{ width: '45%', marginRight: '2.5%' }} />
                  </Form.Item>

                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    style={{ marginTop: 8 }}
                    onClick={() => remove(field.name)}
                  />
                </Form.Item>
              ))}
              <Form.Item label={fields.length ? ' ' : 'Sizes'}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Th??m size
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      )
    },
    {
      name: 'category_id',
      label: 'Danh m???c',
      rules: [{ required: true, message: 'Vui l??ng ch???n danh m???c cho s???n ph???m!' }],
      component: (
        <TreeSelect
          treeDefaultExpandAll
          placeholder="Ch???n danh m???c"
        >
          {categories.map(renderCategoryItem)}
        </TreeSelect>
      )
    },
    {
      name: 'image',
      valuePropName: 'fileList',
      label: 'H??nh ???nh ?????i di???n',
      getValueFromEvent: onUploadChange,
      rules: [{ required: true, min: 1, type: 'array', message: 'Vui l??ng ch???n h??nh ???nh!' }],
      // rules: [{ required: true, message: 'Vui l??ng nh???p h??nh ???nh!' }]
      component: (
        <Upload
          accept="image/*"
          listType="picture"
          showUploadList={false}
          maxCount={maxProductImage}
          className={`avatar-uploader ${styles.uploadButton}`}
          beforeUpload={onBeforeUpload}
        >
          {state.image
            ? <img src={state.image.base64 ?? state.image} alt="avatar" className={styles.uploadImage} />
            : (
              <div className={styles.uploadButtonPlaceholder}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Ch???n ???nh</div>
              </div>
            )}
        </Upload>
      )
    },
    {
      name: 'imageList',
      valuePropName: 'fileList',
      label: 'H??nh ???nh chi ti???t',
      getValueFromEvent: onUploadImageListChange,
      rules: [{ required: true, min: 1, type: 'array', message: 'Vui l??ng ch???n h??nh ???nh!' }],
      component: (
        <Upload
          accept="image/*"
          listType="picture-card"
          className="avatar-uploader"
          maxCount={maxProductImageList}
          multiple={state.imageList.length < maxProductImageList - 1}
          beforeUpload={onBeforeUpload}
        >
          {state.imageList.length < maxProductImageList && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Ch???n ???nh</div>
            </div>
          )}
        </Upload>
      )
    },
    {
      name: 'specifications',
      label: 'Th??ng tin chi ti???t',
      rules: [{ required: true, message: 'Vui l??ng nh???p th??ng tin chi ti???t!' }],
      component: <Input.TextArea rows={3} />,
    },
    {
      name: 'description',
      label: 'M?? t???',
      rules: [
        { required: true, message: 'Vui l??ng nh???p m?? t??? cho s???n ph???m!' },
        { max: 1000, message: 'M?? t??? qu?? d??i!' }
      ],
      component: <Input.TextArea rows={5} />
    },
    {
      name: 'submit',
      wrapperCol: {
        offset: 5,
        span: 10,
      },
      component: (
        <Button type="primary" htmlType="submit">
          C???p nh???t
        </Button>
      )
    },
  ], [
    categories,
    state.image,
    state.imageList.length,
    renderCategoryItem,
    onBeforeUpload,
    onUploadChange,
    onUploadImageListChange,
  ]);

  const onClickRemoveProduct = React.useCallback(() => {
    const modal = Modal.confirm({
      maskClosable: false,
      okButtonProps: { danger: true },
      title: `B???n c?? ch???c ch???n mu???n x??a s???n ph???m ${state.selectedProduct.name}?`,
      okText: 'X??c nh???n',
      cancelText: 'H???y b???',
      onOk: () => dispatch({
        type: ActionTypes.DELETE_PRODUCT,
        payload: state.selectedProduct,
        route: routes.PRODUCTS.path,
      })
    });

    modalRef.current = modal;
  }, [dispatch, state.selectedProduct]);

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

  return (
    <div className={styles.container}>
      <Card
        title={`S???n ph???m: ${state.selectedProduct.name}`}
        extra={<Button danger icon={<FaTrashAlt />} onClick={onClickRemoveProduct} />}
      >
        <Form
          name="product-form"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
          initialValues={{
            ...state.selectedProduct,
            sizes: state.selectedProduct.detail_products,
            image: [{
              url: getFormatImageSource(state.selectedProduct.image),
              originUrl: state.selectedProduct.image,
            }],
            imageList: state.imageList
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {formItems.map(renderFormItem)}
        </Form>
      </Card>
    </div>
  );
}

export default ProductDetailPage;
