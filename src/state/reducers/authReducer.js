import { AUTHENTICATE_USER, LOGOUT_USER } from '../actions/actionTypes';

const INITIAL_STATE = {
  accessToken: '',
  expiresIn: '',
  username: '',
  maxAge: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATE_USER.SUCCESS:
      console.log('AUTH', action.payload);
      return {
        ...state,
        accessToken: action.payload.accessToken,
        expiresIn: action.payload.expiresIn,
        username: action.payload.username,
        maxAge: action.payload.maxAge,
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
