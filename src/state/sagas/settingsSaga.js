import Expo from 'expo';
import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import firebase from 'firebase';
import { getAuthUsername } from '../rootReducer';
import * as settingsActions from '../actions/settingsActions';
import {
  FETCH_CURRENT_USER_SETTINGS,
  CURRENT_USER_UNREPORT_POST,
  CURRENT_USER_REPORT_POST,
  UPDATE_NSFW_DISPLAY_SETTING,
  FETCH_REPORTED_POSTS,
  UPDATE_VOTING_SLIDER_SETTING,
} from '../actions/actionTypes';
import { getUserEnableVoteSliderRef, getUserVotePercentRef } from 'util/firebaseUtils';

const baseUserSettingsRef = 'user-settings';
const getUserSettings = username => `${baseUserSettingsRef}/${username}/settings`;
const getNSFWDisplaySettingsRef = username => `${getUserSettings(username)}/display-nsfw-setting`;

const getUserReportedPostsRef = username => `${baseUserSettingsRef}/${username}/reported-posts`;
const getReportPostRef = (username, postID) => `${getUserReportedPostsRef(username)}/${postID}`;

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

const fetchReportedPosts = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserReportedPostsRef(userID), 'value');
    const reportedPosts = snapshot.val() || {};
    yield put(settingsActions.fetchReportedPosts.success(reportedPosts));
  } catch (error) {
    console.log(error);
    yield put(settingsActions.fetchReportedPosts.fail({ error }));
  } finally {
    yield put(settingsActions.fetchReportedPosts.loadingEnd());
  }
};

const reportPost = function*(action) {
  try {
    const { author, permlink, title, id, created } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const postData = { author, permlink, title, id, created };
    yield call(setFirebaseData, getReportPostRef(userID, id), postData);
    yield call(fetchReportedPosts);
    yield put(settingsActions.reportPost.success());
  } catch (error) {
    console.log(error);
    const { id } = action.payload;
    yield put(settingsActions.reportPost.fail({ error }, id));
  } finally {
    const { id } = action.payload;
    yield put(settingsActions.reportPost.loadingEnd(id));
  }
};

const unreportPost = function*(action) {
  try {
    const { id } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getReportPostRef(userID, id), null);
    yield put(settingsActions.unreportPost.success(id));
    yield call(fetchReportedPosts);
  } catch (error) {
    console.log(error);
    const { id } = action.payload;
    yield put(settingsActions.unreportPost.fail({ error }, id));
  } finally {
    const { id } = action.payload;
    yield put(settingsActions.unreportPost.loadingEnd(id));
  }
};

const updateVotingSliderSetting = function*(action) {
  try {
    const { enableVotingSlider } = action.payload;
    const authUsername = yield select(getAuthUsername);

    yield call(setFirebaseData, getUserEnableVoteSliderRef(authUsername), enableVotingSlider);
    yield put(settingsActions.updateVotingSliderSetting.success(enableVotingSlider));
  } catch (error) {
    yield put(settingsActions.updateVotingSliderSetting.fail({ error }));
  }
};

export const watchFetchUserSettings = function*() {
  yield takeLatest(FETCH_CURRENT_USER_SETTINGS.ACTION, fetchUserSettings);
};

export const watchSaveNSFWDisplaySetting = function*() {
  yield takeLatest(UPDATE_NSFW_DISPLAY_SETTING.ACTION, saveNSFWDisplaySetting);
};

export const watchReportPost = function*() {
  yield takeEvery(CURRENT_USER_REPORT_POST.ACTION, reportPost);
};

export const watchUnreportPost = function*() {
  yield takeEvery(CURRENT_USER_UNREPORT_POST.ACTION, unreportPost);
};

export const watchFetchReportedPosts = function*() {
  yield takeLatest(FETCH_REPORTED_POSTS.ACTION, fetchReportedPosts);
};

export const watchUpdateVotingSliderSetting = function*() {
  yield takeLatest(UPDATE_VOTING_SLIDER_SETTING.ACTION, updateVotingSliderSetting);
};
