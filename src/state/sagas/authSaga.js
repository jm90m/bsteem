import { takeLatest, call, put, select } from 'redux-saga/effects';
import sc2 from 'api/sc2';
import * as authActions from 'state/actions/authActions';
import * as currentUserActions from 'state/actions/currentUserActions';
import { BASE_NOTIFICATIONS_URL } from 'constants/notifications';
import * as settingsActions from 'state/actions/settingsActions';
import { Notifications } from 'expo';
import {
  AUTHENTICATE_USER,
  GET_NOTIFICATIONS,
  GET_AUTH_USER_SC_DATA,
  SAVE_NOTIFICATIONS_LAST_TIMESTAMP,
  LOGOUT_USER,
} from '../actions/actionTypes';
import { getAuthAccessToken, getAuthUsername } from '../rootReducer';

const authenticateUser = function*(busyAPI, action) {
  try {
    const { accessToken, expiresIn, username, maxAge } = action.payload;
    const payload = {
      accessToken,
      expiresIn,
      username,
      maxAge,
    };
    yield put(authActions.authenticateUser.success(payload));
    yield put(currentUserActions.currentUserFollowListFetch.action());
    yield put(settingsActions.getCurrentUserSettings.action());
    yield call(busyAPI.sendAsync.bind(busyAPI), 'login', [accessToken]);
  } catch (error) {
    yield put(authActions.authenticateUser.fail(error));
  }
};

export const fetchSteemConnectAuthUserData = function*() {
  try {
    const accessToken = yield select(getAuthAccessToken);
    sc2.setAccessToken(accessToken);
    const response = yield call(sc2.me.bind(sc2));
    console.log('SC2 RESPONSME', response);
    yield put(authActions.getSteemConnectUserData.success(response));
  } catch (error) {
    console.log(error);
    yield put(authActions.getSteemConnectUserData.fail(error));
  }
};

async function getMetadata() {
  return sc2.me().then(resp => resp.user_metadata);
}

export const saveNotificationsLastTimestamp = function*(action) {
  try {
    const { timestamp } = action.payload;
    const userMetaData = yield call(getMetadata);
    const updatedUserMetaData = {
      ...userMetaData,
      notifications_last_timestamp: timestamp,
    };
    const result = yield call(sc2.updateUserMetadata.bind(sc2), updatedUserMetaData);
    yield put(authActions.saveNotificationsLastTimestamp.success(updatedUserMetaData));
  } catch (error) {
    console.log('ERROR SAVING NOTIFICATIONS TIMESTAMP', error.message);
    yield put(authActions.saveNotificationsLastTimestamp.fail(error));
  }
};

export const fetchNotifications = function*(busyAPI) {
  try {
    const authUsername = yield select(getAuthUsername);
    const result = yield call(busyAPI.sendAsync.bind(busyAPI), 'get_notifications', [authUsername]);
    yield put(currentUserActions.getNotifications.success(result));
  } catch (error) {
    yield put(currentUserActions.getNotifications.fail(error));
  }
};

async function unregisterPushNotification(accessToken, authUsername) {
  const url = `${BASE_NOTIFICATIONS_URL}/notifications/unregister`;
  const token = await Notifications.getExpoPushTokenAsync();

  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken,
    },
    body: JSON.stringify({
      token,
      username: authUsername,
      accessToken,
    }),
  });
}

const logoutUser = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    const accessToken = yield select(getAuthAccessToken);
    yield call(unregisterPushNotification, accessToken, authUsername);
  } catch (error) {
    console.log('Failed to unregister push', error);
  }
};

export const watchAuthenticateUser = function*(busyAPI) {
  yield takeLatest(AUTHENTICATE_USER.ACTION, authenticateUser, busyAPI);
};

export const watchFetchSteemConnectAuthUserData = function*() {
  yield takeLatest(GET_AUTH_USER_SC_DATA.ACTION, fetchSteemConnectAuthUserData);
};

export const watchSaveNotificationsLastTimestamp = function*() {
  yield takeLatest(SAVE_NOTIFICATIONS_LAST_TIMESTAMP.ACTION, saveNotificationsLastTimestamp);
};

export const watchFetchNotifications = function*(busyAPI) {
  yield takeLatest(GET_NOTIFICATIONS.ACTION, fetchNotifications, busyAPI);
};

export const watchLogoutUser = function*() {
  yield takeLatest(LOGOUT_USER, logoutUser);
};
