import * as ActionTypes from '../actionTypes';

const defaultState = {
  transactionList: [],
  loading: true,
  selectedTransaction: null,
};

export default function ordersReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.GET_TRANSACTIONS:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactionList: action.payload,
      }
    case ActionTypes.GET_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
      }
    case ActionTypes.SELECT_TRANSACTION:
      return {
        ...state,
        selectedTransaction: action.payload,
      }
    case ActionTypes.LOGOUT_DONE:
      return defaultState;
    default: return state;
  }
}