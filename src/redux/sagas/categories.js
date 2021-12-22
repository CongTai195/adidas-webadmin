import { call, put, all, takeLeading, delay } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, responseStatus } from '../../constants';

function* getCategories() {
  let errorMessage = 'Failed to get categories';

  try {
    const { data } = yield axiosClient.get('/category');

    if (data.status === responseStatus.OK) {
      yield delay(500)
      yield put({ type: ActionTypes.GET_CATEGORIES_SUCCESS, payload: data.results });
      return;
    }

    errorMessage = data.errors?.jwt_mdlw_error ?? errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_CATEGORIES_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* deleteCategory(action) {
  let errorMessage = 'Failed to delete categories';

  try {
    const { payload } = action;

    const { data } = yield axiosClient.delete('/category', {
      data: { ids: [payload.id] }
    });

    if (data.status === responseStatus.OK) {
      yield delay(3000)
      yield put({ type: ActionTypes.DELETE_CATEGORY_SUCCESS, payload });
      return;
    }

    errorMessage = data.errors?.jwt_mdlw_error ?? errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.DELETE_CATEGORY_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* addCategory(action) {
  let errorMessage = 'Failed to create categories';

  try {
    const { payload } = action;

    const body = { name: payload.name }

    if (payload.type) {
      body.type = payload.type;
    }

    const { data } = yield axiosClient.post('/category', body);

    if (data.status === responseStatus.OK) {
      yield delay(3000)

      yield all([
        put({ type: ActionTypes.ADD_CATEGORY_SUCCESS }),
        put({ type: ActionTypes.GET_CATEGORIES })
      ]);
      return;
    }

    errorMessage = data.errors?.jwt_mdlw_error ?? errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.ADD_CATEGORY_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* updateCategory(action) {
  let errorMessage = 'Failed to update categories';

  try {
    const { payload } = action;

    const body = {
      name: payload.name,
      type: payload.type,
    };

    const { data } = yield axiosClient.put(`/category/${payload.id}`, body);

    if (data.status === responseStatus.OK) {
      yield delay(3000)
      yield all([
        put({ type: ActionTypes.UPDATE_CATEGORY_SUCCESS }),
        put({ type: ActionTypes.GET_CATEGORIES })
      ]);
      return;
    }

    errorMessage = (data.errors?.jwt_mdlw_error ?? data.results?.error) || errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.UPDATE_CATEGORY_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

export default function* categoriesSaga() {
  yield takeLeading(ActionTypes.GET_CATEGORIES, getCategories);
  yield takeLeading(ActionTypes.ADD_CATEGORY, addCategory);
  yield takeLeading(ActionTypes.UPDATE_CATEGORY, updateCategory);
  yield takeLeading(ActionTypes.DELETE_CATEGORY, deleteCategory);
}