import { FETCH_USER } from './actionTypes';

export const fetchUserFail = error => ({
  type: FETCH_USER.ERROR,
  error,
});

export const fetchUserSuccess = payload => ({
  type: FETCH_USER.SUCCESS,
  payload,
});

export const fetchUser = username => ({
  type: FETCH_USER.PENDING,
  payload: {
    username,
  },
});
