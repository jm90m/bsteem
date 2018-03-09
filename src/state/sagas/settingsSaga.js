import Expo from 'expo';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import _ from 'lodash';
import firebase from 'firebase';
import { getAuthUsername } from '../rootReducer';
import * as settingsActions from '../actions/settingsActions';
import { FETCH_CURRENT_USER_SETTINGS, UPDATE_NSFW_DISPLAY_SETTING } from '../actions/actionTypes';

const baseUserSettingsRef = 'user-settings';
const getUserSettings = username => `${baseUserSettingsRef}/${username}/settings`;
const getNSFWDisplaySettingsRef = username => `${getUserSettings(username)}/display-nsfw-setting`;

const getFirebaseValueOnce = (ref, key) =>
  firebase
    .database()
    .ref(ref)
    .once(key);

const setFirebaseData = (ref, values = {}) => {
  firebase
    .database()
    .ref(ref)
    .set(values);
};

export const fetchUserSettings = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;

    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserSettings(userID), 'value');
    const settings = snapshot.val() || {};
    yield put(settingsActions.getCurrentUserSettings.success(settings));
  } catch (error) {
    console.log(error);
    yield put(settingsActions.getCurrentUserSettings.fail({ error }));
  } finally {
    yield put(settingsActions.getCurrentUserSettings.loadingEnd());
  }
};

const saveNSFWDisplaySetting = function*(action) {
  try {
    const displayNSFWContent = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getNSFWDisplaySettingsRef(userID), displayNSFWContent);
    yield call(fetchUserSettings);
    yield put(settingsActions.updateNSFWDisplaySettings.success(displayNSFWContent));
  } catch (error) {
    console.log(error);
    yield put(settingsActions.updateNSFWDisplaySettings.fail({ error }));
  } finally {
    yield put(settingsActions.updateNSFWDisplaySettings.loadingEnd());
  }
};

export const watchFetchUserSettings = function*() {
  yield takeLatest(FETCH_CURRENT_USER_SETTINGS.ACTION, fetchUserSettings);
};

export const watchSaveNSFWDisplaySetting = function*() {
  yield takeLatest(UPDATE_NSFW_DISPLAY_SETTING.ACTION, saveNSFWDisplaySetting);
};
