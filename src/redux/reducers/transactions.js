import * as ActionTypes from '../actionTypes';

const defaultState = {
  loading: true,
  transactionList: [],
  updateLoading: false,
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
    case ActionTypes.UPDATE_TRANSACTION:
      return {
        ...state,
        updateLoading: true,
      }
    case ActionTypes.UPDATE_TRANSACTION_SUCCESS: {
      const updateState = {
        updateLoading: false,
        selectedTransaction: {
          ...state.selectedTransaction,
          status: action.payload.status,
        }
      };

      const itemIndex = state.transactionList.findIndex((x) => x.id === action.payload.id);

      if (itemIndex > -1) {
        updateState.transactionList = JSON.parse(JSON.stringify(state.transactionList));
        updateState.transactionList[itemIndex].status = action.payload.status;
      }

      return {
        ...state,
        ...updateState
      }
    }
    case ActionTypes.UPDATE_TRANSACTION_FAILED:
      return {
        ...state,
        updateLoading: false,
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