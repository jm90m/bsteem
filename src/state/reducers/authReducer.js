import { AUTHENTICATE_USER } from '../actions/actionTypes';

const INITIAL_STATE = {
  accessToken: '',
  expiresIn: '',
  username: '',
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
      };
    default:
      return state;
  }
};

export const getAccessToken = state => state.auth.accessToken;
export const getExpiresIn = state => state.auth.expiresIn;
export const getUsername = state => state.auth.username;
