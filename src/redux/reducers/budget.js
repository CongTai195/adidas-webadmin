import * as ActionTypes from "../actionTypes";

const defaultState = {
  budgetList: [],
  yearBudgetList: [],
  loading: true,
  blockLoading: false,
};

export default function budgetReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.GET_BUDGET:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_BUDGET_SUCCESS:
      return {
        ...state,
        loading: false,
        budgetList: action.payload,
      };
    case ActionTypes.GET_BUDGET_FAILED:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.GET_YEARBUDGET:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_YEARBUDGET_SUCCESS:
      return {
        ...state,
        loading: false,
        yearBudgetList: action.payload,
      };
    case ActionTypes.GET_YEARBUDGET_FAILED:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.LOGOUT_DONE:
      return defaultState;
    default:
      return state;
  }
}
