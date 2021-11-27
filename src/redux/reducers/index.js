import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from './app';
import usersReducer from './users';
import productReducer from './products';
import categoriesReducer from './categories';
import transactionsReducer from './transactions';
import budgetReducer from './budget';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  app: appReducer,
  users: usersReducer,
  products: productReducer,
  categories: categoriesReducer,
  transactions: transactionsReducer,
  budget: budgetReducer,
});

export default createRootReducer;