import { all, fork } from 'redux-saga/effects';

import appSaga from './app';
import usersSaga from './users';
import productsSaga from './products';
import categoriesSaga from './categories';
import transactionsSaga from './transactions'
import budgetSaga from './budget'

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(usersSaga),
    fork(productsSaga),
    fork(categoriesSaga),
    fork(transactionsSaga),
    fork(budgetSaga),
  ]);
}
