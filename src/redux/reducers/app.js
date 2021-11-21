import { localStorageKey } from '../../constants';
import * as ActionTypes from '../actionTypes';

const collapsed = localStorage.getItem(localStorageKey.SIDEBAR_COLLAPSED);

const defaultState = {
  user: null,
  loading: true,
  loginLoading: false,
  collapsed: collapsed === 'true',
};

export default function appReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        loginLoading: true,
      }
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.CHECK_LOGIN_DONE:
      return {
        ...state,
        loading: false,
        loginLoading: false,
        user: action.payload,
      }
    case ActionTypes.LOGIN_FAILED:
      return {
        ...state,
        loginLoading: false,
      }
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        collapsed: !state.collapsed,
      }
    case ActionTypes.LOGOUT_DONE:
      return {
        ...defaultState,
        loading: false,
      };
    default:
      return state;
  }
}