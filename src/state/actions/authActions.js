import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  AUTHENTICATE_USER,
  LOGOUT_USER,
  GET_AUTH_USER_SC_DATA,
  SAVE_NOTIFICATIONS_LAST_TIMESTAMP,
  SET_CURRENT_USER_NAVIGATION,
} from './actionTypes';

export const authenticateUser = createAsyncSagaAction(AUTHENTICATE_USER);

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const getSteemConnectUserData = createAsyncSagaAction(GET_AUTH_USER_SC_DATA);
export const saveNotificationsLastTimestamp = createAsyncSagaAction(
  SAVE_NOTIFICATIONS_LAST_TIMESTAMP,
);
export const setCurrentUserNavigation = payload => ({
  type: SET_CURRENT_USER_NAVIGATION,
  payload,
});
