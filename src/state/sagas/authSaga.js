import { takeLatest, call, put, select } from 'redux-saga/effects';
import sc2 from 'api/sc2';
import * as authActions from 'state/actions/authActions';
import * as currentUserActions from 'state/actions/currentUserActions';
import _ from 'lodash';
import * as settingsActions from 'state/actions/settingsActions';
import { Notifications } from 'expo';
import {
  AUTHENTICATE_USER,
  FETCH_BSTEEM_NOTIFICATIONS,
  GET_AUTH_USER_SC_DATA,
  SAVE_NOTIFICATIONS_LAST_TIMESTAMP,
  LOGOUT_USER,
} from '../actions/actionTypes';
import { getAuthAccessToken, getAuthUsername } from '../rootReducer';

const authenticateUser = function*(action) {
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
  } catch (error) {
    yield put(authActions.authenticateUser.fail(error));
  }
};

export const fetchSteemConnectAuthUserData = function*() {
  try {
    const accessToken = yield select(getAuthAccessToken);
    sc2.setAccessToken(accessToken);
    const response = yield call(sc2.me);
    console.log(response);
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
    const result = yield call(sc2.updateUserMetadata, updatedUserMetaData);
    yield put(authActions.saveNotificationsLastTimestamp.success(updatedUserMetaData));
  } catch (error) {
    console.log('ERROR SAVING NOTIFICATIONS TIMESTAMP', error.message);
    yield put(authActions.saveNotificationsLastTimestamp.fail(error));
  }
};

async function fetchNotifications(accessToken, limit) {
  const url = `https://bsteem-notifications.herokuapp.com/notifications?limit=${limit}`;
  return fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      authorization: accessToken,
    },
  }).then(response => response.json());
}

export const fetchBSteemNotifications = function*(action) {
  try {
    const limit = 50;
    const accessToken = yield select(getAuthAccessToken);
    const response = yield call(fetchNotifications, accessToken, limit);
    console.log('NOTIFICATIONS SUCCESS BSTEEM', response);
    yield put(authActions.fetchBSteemNotifications.success(_.reverse(response)));
  } catch (error) {
    console.log(error);
    yield put(authActions.fetchBSteemNotifications.fail(error));
  }
};

async function unregisterPushNotification(accessToken, authUsername) {
  const url = 'https://bsteem-notifications.herokuapp.com/notifications/unregister';
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

export const watchAuthenticateUser = function*() {
  yield takeLatest(AUTHENTICATE_USER.ACTION, authenticateUser);
};

export const watchFetchSteemConnectAuthUserData = function*() {
  yield takeLatest(GET_AUTH_USER_SC_DATA.ACTION, fetchSteemConnectAuthUserData);
};

export const watchSaveNotificationsLastTimestamp = function*() {
  yield takeLatest(SAVE_NOTIFICATIONS_LAST_TIMESTAMP.ACTION, saveNotificationsLastTimestamp);
};

export const watchFetchBSteemNotifications = function*() {
  yield takeLatest(FETCH_BSTEEM_NOTIFICATIONS.ACTION, fetchBSteemNotifications);
};

export const watchLogoutUser = function*() {
  yield takeLatest(LOGOUT_USER, logoutUser);
};
