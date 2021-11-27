import { put, call, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, responseStatus } from '../../constants';

function* getUserAction() {
  let errorMessage = '';

  try {
    const { data } = yield axiosClient.get('/user');

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.GET_USERS_SUCCESS, payload: data.results });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_USERS_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* blockUserAction(action) {
  let errorMessage = '';

  try {
    const { id, deleted_at } = action.payload;

    let methodName = 'delete';

    let url = '/user';

    let params = {
      data: { ids: [id] }
    }

    if (deleted_at) {
      url = '/user/restore-users';
      methodName = 'post';
      params = { ids: [id] }
    }

    const { data } = yield axiosClient[methodName](url, params);

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.BLOCK_USER_SUCCESS, payload: action.payload });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.BLOCK_USER_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_USERS, getUserAction);
  yield takeLeading(ActionTypes.BLOCK_USER, blockUserAction);
}