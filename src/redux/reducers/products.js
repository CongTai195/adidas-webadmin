import * as ActionTypes from '../actionTypes';

const defaultState = {
  loading: true,
  productList: [],
  addLoading: false,
  searchSuggests: [],
  deleteLoading: false,
  selectedProduct: null,
  isSearched: false,
  searchResults: [],
};

export default function productReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SELECT_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      }
    case ActionTypes.GET_PRODUCTS:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        productList: action.payload,
      }
    case ActionTypes.GET_PRODUCTS_FAILED:
      return {
        ...state,
        loading: false,
      }
    case ActionTypes.DELETE_PRODUCT:
      return {
        ...state,
        deleteLoading: true,
      }
    case ActionTypes.DELETE_PRODUCT_SUCCESS: {
      const productList = JSON.parse(JSON.stringify(state.productList));

      const productIndex = productList.findIndex((x) => x.id === action.payload.id);

      if (productIndex > -1) {
        productList.splice(productIndex, 1);
      }

      return {
        ...state,
        productList,
        deleteLoading: false,
      }
    }
    case ActionTypes.DELETE_PRODUCT_FAILED:
      return {
        ...state,
        deleteLoading: false,
      }
    case ActionTypes.ADD_PRODUCT:
      return {
        ...state,
        addLoading: true,
      }
    case ActionTypes.ADD_PRODUCT_SUCCESS:
    case ActionTypes.ADD_PRODUCT_FAILED:
      return {
        ...state,
        addLoading: false,
      }
    // case ActionTypes.SUGGEST_SEARCH_PRODUCT:
    case ActionTypes.SUGGEST_SEARCH_PRODUCT_SUCCESS: {
      return {
        ...state,
        searchSuggests: action.payload,
      }
    }
    case ActionTypes.SUGGEST_SEARCH_PRODUCT_FAILED:
      return {
        ...state,
        searchSuggests: [],
      }
    case ActionTypes.SUBMIT_PRODUCT_SUGGEST: {
      const updateStates = {
        isSearched: true,
        searchResults: state.productList.filter((x) => x.name.includes(action.payload)),
      };

      return {
        ...state,
        ...updateStates,
      }
    }
    case ActionTypes.CLEAR_PRODUCT_SUGGEST:
      return {
        ...state,
        isSearched: false,
        searchResults: [],
      }
    case ActionTypes.LOGOUT_DONE:
      return defaultState;
    default: return state;
  }
}