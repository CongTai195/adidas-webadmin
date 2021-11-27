import * as ActionTypes from '../actionTypes';

const defaultState = {
  loading: true,
  categoryList: [],
  updateLoading: false,
  addLoading: false,
  deleteLoading: false,
};

export default function categoriesReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.GET_CATEGORIES:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryList: action.payload,
      }
    case ActionTypes.GET_CATEGORIES_FAILED:
      return {
        ...state,
        loading: false,
      }

    case ActionTypes.DELETE_CATEGORY:
      return {
        ...state,
        deleteLoading: true,
      }
    case ActionTypes.DELETE_CATEGORY_SUCCESS: {
      const updateStates = { deleteLoading: false };

      const categoryIndex = state.categoryList.findIndex((x) => x.id === action.payload.id);

      if (categoryIndex > -1) {
        updateStates.categoryList = JSON.parse(JSON.stringify(state.categoryList));

        updateStates.categoryList.splice(categoryIndex, 1);
      }

      return {
        ...state,
        ...updateStates,
      }
    }
    case ActionTypes.DELETE_CATEGORY_FAILED:
      return {
        ...state,
        deleteLoading: false,
      }

    case ActionTypes.UPDATE_CATEGORY:
      return {
        ...state,
        updateLoading: true,
      }
    case ActionTypes.UPDATE_CATEGORY_SUCCESS:
    case ActionTypes.UPDATE_CATEGORY_FAILED:
      return {
        ...state,
        updateLoading: false,
      }

    case ActionTypes.ADD_CATEGORY:
      return {
        ...state,
        addLoading: true,
      }
    case ActionTypes.ADD_CATEGORY_SUCCESS:
    case ActionTypes.ADD_CATEGORY_FAILED:
      return {
        ...state,
        addLoading: false,
      }

    default: return state;
  }
}