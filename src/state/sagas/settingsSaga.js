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
  getUserCustomThemeSettingsRef,
  getPostPreviewCompactModeSettingRef,
  getUserLanguageSettingRef,
  getUserSignatureSettingRef,
  getUserEnableSignatureSettingRef,
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
  UPDATE_CUSTOM_THEME,
  UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS,
  UPDATE_USER_LANGUAGE,
  UPDATE_USER_SIGNATURE,
  UPDATE_ENABLE_USER_SIGNATURE,
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
    const languageSetting = _.get(settings, 'language-setting', 'en_US');
    yield put(settingsActions.getCurrentUserSettings.success(settings));
    yield put(settingsActions.setLanguageSetting(languageSetting));
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

const savePostPreviewSetting = function*(action) {
  try {
    const compactMode = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getPostPreviewCompactModeSettingRef(userID), compactMode);
    yield call(fetchUserSettings);
    yield put(settingsActions.updatePostPreviewCompactModeSettings.success(compactMode));
  } catch (error) {
    console.log(error);
    yield put(settingsActions.updatePostPreviewCompactModeSettings.fail({ error }));
  } finally {
    yield put(settingsActions.updatePostPreviewCompactModeSettings.loadingEnd());
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

const updateUserLanguageSetting = function*(action) {
  try {
    const languageSetting = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getUserLanguageSettingRef(userID), languageSetting);
    yield put(settingsActions.updateUserLanguageSetting.success(languageSetting));
  } catch (error) {
    yield put(settingsActions.updateUserLanguageSetting.fail({ error }));
  }
};

const updateCustomTheme = function*(action) {
  try {
    const {
      primaryColor,
      secondaryColor,
      tertiaryColor,
      listBackgroundColor,
      primaryBackgroundColor,
      primaryBorderColor,
      positiveColor,
      negativeColor,
    } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }

    const customTheme = {
      primaryColor,
      secondaryColor,
      tertiaryColor,
      listBackgroundColor,
      primaryBackgroundColor,
      primaryBorderColor,
      positiveColor,
      negativeColor,
    };

    yield call(setFirebaseData, getUserCustomThemeSettingsRef(userID), customTheme);
    yield put(settingsActions.updateCustomTheme.success(customTheme));
  } catch (error) {
    yield put(settingsActions.updateCustomTheme.fail({ error }));
  }
};

const updateUserSignature = function*(action) {
  try {
    const { signature, successCallback } = action.payload;
    const authUsername = yield select(getAuthUsername);

    yield call(setFirebaseData, getUserSignatureSettingRef(authUsername), signature);

    _.attempt(successCallback);

    yield put(settingsActions.updateUserSignature.success(signature));
  } catch (error) {
    yield put(settingsActions.updateUserSignature.fail({ error }));
  }
};

const updateEnableUserSignature = function*(action) {
  try {
    const { enableSignature } = action.payload;
    const authUsername = yield select(getAuthUsername);

    yield call(setFirebaseData, getUserEnableSignatureSettingRef(authUsername), enableSignature);
    yield put(settingsActions.updateEnableUserSignature.success(enableSignature));
  } catch (error) {
    yield put(settingsActions.updateEnableUserSignature.fail({ error }));
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

export const watchUpdateCustomTheme = function*() {
  yield takeLatest(UPDATE_CUSTOM_THEME.ACTION, updateCustomTheme);
};

export const watchSavePostPreviewSetting = function*() {
  yield takeLatest(UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS.ACTION, savePostPreviewSetting);
};

export const watchUpdateUserLanguageSetting = function*() {
  yield takeLatest(UPDATE_USER_LANGUAGE.ACTION, updateUserLanguageSetting);
};

export const watchUpdateUserSignature = function*() {
  yield takeLatest(UPDATE_USER_SIGNATURE.ACTION, updateUserSignature);
};

export const watchUpdateEnableUserSignature = function*() {
  yield takeLatest(UPDATE_ENABLE_USER_SIGNATURE.ACTION, updateEnableUserSignature);
};
