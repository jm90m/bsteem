import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  UPDATE_NSFW_DISPLAY_SETTING,
  FETCH_CURRENT_USER_SETTINGS,
  CURRENT_USER_REPORT_POST,
  CURRENT_USER_UNREPORT_POST,
  FETCH_REPORTED_POSTS,
  UPDATE_VOTING_SLIDER_SETTING,
  UPDATE_VOTING_PERCENT_SETTING,
  UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS,
  UPDATE_CUSTOM_THEME,
  UPDATE_USER_LANGUAGE,
  SET_LANGUAGE_SETTING,
  UPDATE_USER_SIGNATURE,
  UPDATE_ENABLE_USER_SIGNATURE
} from './actionTypes';

export const updateNSFWDisplaySettings = createAsyncSagaAction(UPDATE_NSFW_DISPLAY_SETTING);
export const getCurrentUserSettings = createAsyncSagaAction(FETCH_CURRENT_USER_SETTINGS);
export const updatePostPreviewCompactModeSettings = createAsyncSagaAction(
  UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS,
);

export const reportPost = createAsyncSagaAction(CURRENT_USER_REPORT_POST);
export const unreportPost = createAsyncSagaAction(CURRENT_USER_UNREPORT_POST);
export const fetchReportedPosts = createAsyncSagaAction(FETCH_REPORTED_POSTS);
export const updateVotingSliderSetting = createAsyncSagaAction(UPDATE_VOTING_SLIDER_SETTING);
export const updateVotingPercentSetting = createAsyncSagaAction(UPDATE_VOTING_PERCENT_SETTING);
export const updateCustomTheme = createAsyncSagaAction(UPDATE_CUSTOM_THEME);
export const updateUserLanguageSetting = createAsyncSagaAction(UPDATE_USER_LANGUAGE);
export const setLanguageSetting = languageSetting => ({
  type: SET_LANGUAGE_SETTING,
  payload: {
    languageSetting,
  },
});

export const updateUserSignature = createAsyncSagaAction(UPDATE_USER_SIGNATURE);
export const updateEnableUserSignature = createAsyncSagaAction(UPDATE_ENABLE_USER_SIGNATURE);
