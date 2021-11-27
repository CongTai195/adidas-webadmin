import { put, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { axiosClient, responseStatus } from '../../constants';

function* getBudgetAction() {
  let errorMessage = '';

  try {
    const { data } = yield axiosClient.get('/order/admin/budget-product');

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.GET_BUDGET_SUCCESS, payload: data.results });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_BUDGET_FAILED });

  alert(errorMessage);
}

function* getYearBudgetAction(action) {
  let errorMessage = '';

  try {
    const { payload } = action;

    const { data } = yield axiosClient.get(`/order/admin/budget-date?date=01-01-${payload.dateString}&group=${payload.viewType}`);

    if (data.status === responseStatus.OK) {
      yield put({ type: ActionTypes.GET_YEARBUDGET_SUCCESS, payload: data.results });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_YEARBUDGET_FAILED });

  alert(errorMessage);
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_BUDGET, getBudgetAction);
  yield takeLeading(ActionTypes.GET_YEARBUDGET, getYearBudgetAction);
}