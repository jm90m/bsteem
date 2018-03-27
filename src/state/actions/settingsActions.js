import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  UPDATE_NSFW_DISPLAY_SETTING,
  FETCH_CURRENT_USER_SETTINGS,
  CURRENT_USER_REPORT_POST,
  CURRENT_USER_UNREPORT_POST,
  FETCH_REPORTED_POSTS,
  UPDATE_VOTING_SLIDER_SETTING,
} from './actionTypes';

export const updateNSFWDisplaySettings = createAsyncSagaAction(UPDATE_NSFW_DISPLAY_SETTING);
export const getCurrentUserSettings = createAsyncSagaAction(FETCH_CURRENT_USER_SETTINGS);

export const reportPost = createAsyncSagaAction(CURRENT_USER_REPORT_POST);
export const unreportPost = createAsyncSagaAction(CURRENT_USER_UNREPORT_POST);
export const fetchReportedPosts = createAsyncSagaAction(FETCH_REPORTED_POSTS);
export const updateVotingSliderSetting = createAsyncSagaAction(UPDATE_VOTING_SLIDER_SETTING);
