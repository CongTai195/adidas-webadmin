import { Modal } from 'antd';
import { push } from 'connected-react-router';
import { put, select, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { axiosClient, responseStatus, routes } from '../../constants';

function* getProducts() {
  let errorMessage = '';

  try {
    const { data } = yield axiosClient.get('/product');

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.GET_PRODUCTS_SUCCESS, payload: data.results });
      return
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_PRODUCTS_FAILED });

  alert(errorMessage);
}

function* addProductAction(action) {
  let errorMessage = 'Failed to create product';

  try {
    const { payload } = action;

    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('category_id', '2');
    formData.append('price', payload.price);
    formData.append('description', payload.description);
    formData.append('specifications', payload.specifications);

    for (const image of payload.image) {
      formData.append('image', image.originFileObj);
    }

    for (const image of payload.imageList) {
      formData.append('image_list[]', image.originFileObj);
    }

    const { data } = yield axiosClient.post('/product', formData);

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.ADD_PRODUCT_SUCCESS });

      yield put({ type: ActionTypes.GET_PRODUCTS });

      let modal;
      yield new Promise((resolve) => {
        modal = Modal.success({
          title: 'Thành công',
          content: 'Cập nhật sản phẩm thành công',
          onOk: resolve,
        })
      });

      modal.destroy();

      yield put(push(routes.PRODUCTS.path))
      return;
    }

    errorMessage = data.errors?.jwt_mdlw_error ?? errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.ADD_PRODUCT_FAILED });

  alert(errorMessage);
}

function* updateProductAction(action) {
  let errorMessage = '';

  try {
    const { payload } = action;
    const selectedProduct = yield select((state) => state.products.selectedProduct);

    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('category_id', selectedProduct.category_id);
    formData.append('price', payload.price);
    formData.append('description', payload.description);
    formData.append('specifications', payload.specifications);
    formData.append('image_list', payload.image);

    const { data } = yield axiosClient.post(`/product/${selectedProduct.id}`, formData);

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.UPDATE_PRODUCT_SUCCESS });

      yield put({ type: ActionTypes.GET_PRODUCTS });

      yield new Promise((resolve) => Modal.success({
        title: 'Thành công',
        content: 'Cập nhật sản phẩm thành công',
        onOk: resolve,
      }));

      yield put(push(routes.PRODUCTS.path))
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.UPDATE_PRODUCT_FAILED });

  alert(errorMessage);
}

function* deleteProductAction(action) {
  let errorMessage = '';

  try {
    const { id } = action.payload;

    const { data } = yield axiosClient.delete('/product', {
      data: {
        ids: [id]
      }
    });

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.DELETE_PRODUCT_SUCCESS, payload: action.payload });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.DELETE_PRODUCT_FAILED });

  alert(errorMessage);
}

function* selectProductAction() {
  yield put(push(routes.PRODUCT_DETAIL.path));
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_PRODUCTS, getProducts);
  yield takeLeading(ActionTypes.ADD_PRODUCT, addProductAction);
  yield takeLeading(ActionTypes.UPDATE_PRODUCT, updateProductAction);
  yield takeLeading(ActionTypes.DELETE_PRODUCT, deleteProductAction);
  yield takeLeading(ActionTypes.SELECT_PRODUCT, selectProductAction);
}