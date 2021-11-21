import { all, fork } from 'redux-saga/effects';

import appSaga from './app';
import usersSaga from './users';
import productsSaga from './products';
import transactionsSaga from './transactions'

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(usersSaga),
    fork(productsSaga),
    fork(transactionsSaga),
  ]);
}
