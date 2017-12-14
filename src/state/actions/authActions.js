import { AUTHENTICATE_USER, LOGOUT_USER } from './actionTypes';

export const authenticateUserSuccess = payload => ({
  type: AUTHENTICATE_USER.SUCCESS,
  payload,
});

export const authenticateUserError = error => ({
  type: AUTHENTICATE_USER.ERROR,
  error,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
