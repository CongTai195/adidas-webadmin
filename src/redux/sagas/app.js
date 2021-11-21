import { put, select, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { axiosClient, localStorageKey, responseStatus } from '../../constants';

function* toggleSideBarAction() {
  const collapsed = yield select((state) => state.app.collapsed);

  localStorage.setItem(localStorageKey.SIDEBAR_COLLAPSED, collapsed);
}

function* checkLoginAction() {
  let loginInfo = localStorage.getItem(localStorageKey.LOGIN_INFO);

  if (!loginInfo) {
    yield put({ type: ActionTypes.CHECK_LOGIN_DONE });
    return;
  }

  try {
    loginInfo = JSON.parse(loginInfo);

    const formData = new FormData();

    formData.append('email', loginInfo.email);
    formData.append('password', loginInfo.password);

    const { data } = yield axiosClient.post('/login', formData);

    if (data.status === responseStatus.OK) {
      axiosClient.defaults.headers.Authorization = `Bearer ${data.results.token}`;

      yield put({
        type: ActionTypes.CHECK_LOGIN_DONE,
        payload: data.results.info
      });
      return;
    }
  } catch (error) {

  }

  yield put({ type: ActionTypes.CHECK_LOGIN_DONE });

  localStorage.removeItem(localStorageKey.LOGIN_INFO);
}

function* loginAction(action) {
  try {
    const { payload } = action;

    const formData = new FormData();

    formData.append('email', payload.email);
    formData.append('password', payload.password);

    const { data } = yield axiosClient.post('/login', formData);

    if (data.status === responseStatus.OK) {
      axiosClient.defaults.headers.Authorization = `Bearer ${data.results.token}`;

      yield put({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data.results.info
      });

      if (payload.remember) {
        const savedData = JSON.stringify({
          email: payload.email,
          password: payload.password,
        });

        localStorage.setItem(localStorageKey.LOGIN_INFO, savedData);
      }
      return;
    }
  } catch (error) {

  }

  yield put({ type: ActionTypes.LOGIN_FAILED });
}

function* logoutAction() {
  try {
    yield axiosClient.get('/logout');
  } catch (error) {

  }

  localStorage.removeItem(localStorageKey.LOGIN_INFO);

  yield put({ type: ActionTypes.LOGOUT_DONE });
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.TOGGLE_SIDEBAR, toggleSideBarAction);
  yield takeLeading(ActionTypes.CHECK_LOGIN, checkLoginAction);
  yield takeLeading(ActionTypes.LOGIN, loginAction);
  yield takeLeading(ActionTypes.LOGOUT, logoutAction);
}