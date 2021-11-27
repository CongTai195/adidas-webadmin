import { Modal } from 'antd';
import { push } from 'connected-react-router';
import { put, call, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, responseStatus, routes } from '../../constants';

function* getTransactions() {
  let errorMessage = '';

  try {
    const { data } = yield axiosClient.get('/transaction');

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.GET_TRANSACTIONS_SUCCESS, payload: data.results });
      return
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_TRANSACTIONS_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* selectTransaction() {
  yield put(push(routes.ORDER_DETAIL.path));
}

function* updateTransaction(action) {
  let errorMessage = 'Failed to update order';

  try {
    const { payload } = action;

    const { data } = yield axiosClient.put(`/transaction/${payload.id}`, {
      status: payload.status,
    });

    if (data.status === responseStatus.OK) {
      Modal.success({
        title: 'Thành công',
        content: 'Cập nhật đơn hàng thành công',
      });

      yield put({ type: ActionTypes.UPDATE_TRANSACTION_SUCCESS, payload });
      return;
    }

    errorMessage = (data.errors?.jwt_mdlw_error ?? data.results?.error) || errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.UPDATE_TRANSACTION_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_TRANSACTIONS, getTransactions);
  yield takeLeading(ActionTypes.SELECT_TRANSACTION, selectTransaction);
  yield takeLeading(ActionTypes.UPDATE_TRANSACTION, updateTransaction);
}