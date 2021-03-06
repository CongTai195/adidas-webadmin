import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  TreeSelect,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import AppInput from '../../components/AppInput';

import styles from './styles.module.css';
import * as ActionTypes from '../../redux/actionTypes';
import { formatCurrency, readFile } from '../../utils';

dayjs.extend(utc)

export const maxProductImage = 1;

export const maxProductImageList = 5;

const AddProductPage = () => {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categoryList);

  const addLoading = useSelector((state) => state.products.addLoading);

  const [state, setState] = React.useState({
    image: null,
    imageList: [],
  });

  const onFinish = React.useCallback((values) => {
    dispatch({ type: ActionTypes.ADD_PRODUCT, payload: values });
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
          disabled={addLoading}
          className={styles.priceInput}
          parser={(value) => value.replace(/\D/g, '').trim()}
          formatter={(value) => formatCurrency(`${value} VN??`)}
        />
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
      name: 'category',
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
              <div style={{ marginTop: 8 }}>Ch???n ???nh</div>
            </div>
          )}
        </Upload>
      )
    },
    {
      name: 'specifications',
      label: 'Chi ti???t s???n ph???m',
      rules: [
        { required: true, message: 'Vui l??ng nh???p chi ti???t s???n ph???m.' },
      ],
      component: <Input.TextArea disabled={addLoading} rows={3} />
    },
    {
      name: 'description',
      label: 'M?? t???',
      rules: [
        { required: true, message: 'Vui l??ng nh???p m?? t??? cho s???n ph???m.' },
        { max: 1000, message: 'M?? t??? qu?? d??i!' },
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
          Th??m
        </Button>
      )
    },
  ], [
    renderCategoryItem,
    onBeforeUpload,
    onUploadChange,
    onUploadImageListChange,
    categories,
    addLoading,
    state.image,
    state.imageList.length,
  ]);

  return (
    <div className={styles.container}>
      <Card title="Th??m s???n ph???m">
        <Form
          name="product-form"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 10 }}
          initialValues={{
            name: '',
            price: 0,
            sizes: [],
            category: null,
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
    </div>
  );
}

export default AddProductPage;
