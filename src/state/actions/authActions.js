import { AUTHENTICATE_USER, LOGOUT_USER } from './actionTypes';
import { createAsyncSagaAction } from 'util/reduxUtils';

export const authenticateUser = createAsyncSagaAction(AUTHENTICATE_USER);

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
