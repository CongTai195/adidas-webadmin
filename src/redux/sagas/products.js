import { Modal } from 'antd';
import { push } from 'connected-react-router';
import { put, call, fork, select, takeLeading, takeLatest } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, imageListSeparator, responseStatus, routes } from '../../constants';

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

  yield call(apiErrorHandler, errorMessage);
}

function* onProductSuccess({ successAction, productId, sizes }) {
  // Show success modal
  const showModal = function* () {
    let modal;
    yield new Promise((resolve) => {
      modal = Modal.success({
        title: 'Thành công',
        content: successAction === ActionTypes.ADD_PRODUCT_SUCCESS ? 'Thêm sản phẩm thành công' : 'Cập nhật sản phẩm thành công',
        onOk: resolve,
      })
    });

    modal.destroy();

    yield put(push(routes.PRODUCTS.path))
  };

  yield fork(showModal);

  // Hide loading
  yield fork(put, { type: successAction });

  // Add product sizes
  for (const sizeItem of sizes) {
    try {
      yield axiosClient.post('/detail-product', {
        product_id: productId,
        quantity: sizeItem.quantity,
        size: sizeItem.size
      });
    } catch (error) {

    }
  }

  // Reload product list
  yield put({ type: ActionTypes.GET_PRODUCTS });
}

function* addProductAction(action) {
  let errorMessage = 'Failed to create product';

  try {
    const { payload } = action;

    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('category_id', `${payload.category}`);
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
      yield call(onProductSuccess, {
        successAction: ActionTypes.ADD_PRODUCT_SUCCESS,
        productId: data.results.id,
        sizes: payload.sizes
      });
      return;
    }

    errorMessage = data.errors?.jwt_mdlw_error ?? errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.ADD_PRODUCT_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* updateProductAction(action) {
  let errorMessage = '';

  try {
    const { payload } = action;
    const selectedProduct = yield select((state) => state.products.selectedProduct);

    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('category_id', payload.category_id);
    formData.append('price', payload.price);
    formData.append('description', payload.description);
    formData.append('specifications', payload.specifications);
    formData.set('image_list_string', '');

    for (const image of payload.image) {
      if (image.originFileObj) {
        formData.append('image', image.originFileObj);
      }
    }

    const oldImageList = [];
    for (const item of payload.imageList) {
      if (item.originUrl) {
        oldImageList.push(item.originUrl);
      } else {
        formData.append('image_list[]', item.originFileObj);
      }
    }

    if (oldImageList.length) {
      formData.set('image_list_string', oldImageList.join(imageListSeparator))
    }

    const { data } = yield axiosClient.post(`/product/${selectedProduct.id}`, formData);

    if (data.status === responseStatus.OK) {
      yield call(onProductSuccess, {
        successAction: ActionTypes.UPDATE_PRODUCT_SUCCESS,
        productId: selectedProduct.id,
        sizes: payload.sizes
      });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.UPDATE_PRODUCT_FAILED });

  yield call(apiErrorHandler, errorMessage);
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

  yield call(apiErrorHandler, errorMessage);
}

function* selectProductAction() {
  yield put(push(routes.PRODUCT_DETAIL.path));
}

function* suggestSearchProductAction(action) {
  try {
    const { data } = yield axiosClient.get(`/product/search-products?name=${action.payload}`);

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.SUGGEST_SEARCH_PRODUCT_SUCCESS, payload: data.results });
      return;
    }
  } catch (error) {

  }

  yield put({ type: ActionTypes.SUGGEST_SEARCH_PRODUCT_FAILED });
}

export default function* productsSaga() {
  yield takeLeading(ActionTypes.GET_PRODUCTS, getProducts);
  yield takeLeading(ActionTypes.ADD_PRODUCT, addProductAction);
  yield takeLeading(ActionTypes.UPDATE_PRODUCT, updateProductAction);
  yield takeLeading(ActionTypes.DELETE_PRODUCT, deleteProductAction);
  yield takeLeading(ActionTypes.SELECT_PRODUCT, selectProductAction);
  yield takeLatest(ActionTypes.SUGGEST_SEARCH_PRODUCT, suggestSearchProductAction);
}