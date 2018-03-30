import Expo from 'expo';
import { takeLatest, call, put, select, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import {
  getUserEnableVoteSliderRef,
  getUserVotePercentRef,
  getNSFWDisplaySettingsRef,
  getUserSettings,
  getUserReportedPostsRef,
  getReportPostRef,
  getFirebaseValueOnce,
  setFirebaseData,
} from 'util/firebaseUtils';
import { getAuthUsername } from '../rootReducer';
import * as settingsActions from '../actions/settingsActions';
import {
  FETCH_CURRENT_USER_SETTINGS,
  CURRENT_USER_UNREPORT_POST,
  CURRENT_USER_REPORT_POST,
  UPDATE_NSFW_DISPLAY_SETTING,
  FETCH_REPORTED_POSTS,
  UPDATE_VOTING_SLIDER_SETTING,
  UPDATE_VOTING_PERCENT_SETTING,
} from '../actions/actionTypes';

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

const updateVotingPercentSetting = function*(action) {
  try {
    const { votingPercent } = action.payload;
    const authUsername = yield select(getAuthUsername);

    yield call(setFirebaseData, getUserVotePercentRef(authUsername), votingPercent);
    yield put(settingsActions.updateVotingPercentSetting.success(votingPercent));
  } catch (error) {
    yield put(settingsActions.updateVotingPercentSetting.fail({ error }));
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

export const watchUpdateVotingPercentSetting = function*() {
  yield takeLatest(UPDATE_VOTING_PERCENT_SETTING.ACTION, updateVotingPercentSetting);
};
