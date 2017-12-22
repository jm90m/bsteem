import { FETCH_STEEM_RATE, FETCH_STEEM_GLOBAL_PROPERTIES } from '../actions/actionTypes';

const INITIAL_STATE = {
  steemRate: 0,
  loadingSteemGlobalProperties: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_STEEM_RATE.SUCCESS:
      return {
        ...state,
        steemRate: action.payload,
      };
    case FETCH_STEEM_GLOBAL_PROPERTIES.ACTION:
      return {
        ...state,
        loadingSteemGlobalProperties: true,
      };
    case FETCH_STEEM_GLOBAL_PROPERTIES.SUCCESS:
      return {
        ...state,
        loadingSteemGlobalProperties: false,
      };
    case FETCH_STEEM_GLOBAL_PROPERTIES.ERROR:
    case FETCH_STEEM_GLOBAL_PROPERTIES.LOADING_END:
      return {
        ...state,
        loadingSteemGlobalProperties: false,
      };
    default:
      return state;
  }
};

export const getAccessToken = state => state.accessToken;
export const getExpiresIn = state => state.expiresIn;
export const getUsername = state => state.username;
export const getIsAuthenticated = state => state.authenticated;
