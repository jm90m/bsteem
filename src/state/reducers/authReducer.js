import { AUTHENTICATE_USER, LOGOUT_USER } from '../actions/actionTypes';

const INITIAL_STATE = {
  accessToken: '',
  expiresIn: '',
  username: '',
  maxAge: null,
  authenticated: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATE_USER.SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        expiresIn: action.payload.expiresIn,
        username: action.payload.username,
        maxAge: action.payload.maxAge,
        authenticated: true,
      };
    case LOGOUT_USER:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export const getAccessToken = state => state.accessToken;
export const getExpiresIn = state => state.expiresIn;
export const getUsername = state => state.username;
export const getIsAuthenticated = state => state.authenticated;
