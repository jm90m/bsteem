import _ from 'lodash';
import { bSteemColors } from 'constants/styles';
import {
  FETCH_CURRENT_USER_SETTINGS,
  UPDATE_NSFW_DISPLAY_SETTING,
  CURRENT_USER_REPORT_POST,
  FETCH_REPORTED_POSTS,
  UPDATE_VOTING_SLIDER_SETTING,
  UPDATE_VOTING_PERCENT_SETTING,
  UPDATE_CUSTOM_THEME,
  UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS,
  UPDATE_USER_SIGNATURE,
  UPDATE_ENABLE_USER_SIGNATURE,
} from '../actions/actionTypes';

const defaultCustomTheme = {
  primaryColor: bSteemColors.primaryColor,
  secondaryColor: bSteemColors.secondaryColor,
  tertiaryColor: bSteemColors.tertiaryColor,
  listBackgroundColor: bSteemColors.listBackgroundColor,
  primaryBackgroundColor: bSteemColors.primaryBackgroundColor,
  primaryBorderColor: bSteemColors.primaryBorderColor,
  positiveColor: bSteemColors.positiveColor,
  negativeColor: bSteemColors.negativeColor,
};

const INITIAL_STATE = {
  displayNSFWContent: false,
  reportedPosts: [],
  pendingReportingPosts: [],
  loadingReportedPosts: false,
  enableVotingSlider: false,
  votingPercent: 100,
  customTheme: defaultCustomTheme,
  compactViewEnabled: false,
  loadingUpdateCompactViewEnabled: false,
  loadingUpdateNSFWDisplaySetting: false,
  loadingUpdateVotingSliderSetting: false,
  loadingSavingSignature: false,
  loadingSavingEnableUserSignature: false,
  languageSetting: 'en_US',
  signature: '',
  enableSignature: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_NSFW_DISPLAY_SETTING.ACTION:
      return {
        ...state,
        loadingUpdateNSFWDisplaySetting: true,
      };
    case UPDATE_NSFW_DISPLAY_SETTING.SUCCESS:
      return {
        ...state,
        displayNSFWContent: action.payload,
        loadingUpdateNSFWDisplaySetting: false,
      };
    case UPDATE_NSFW_DISPLAY_SETTING.ERROR:
      return {
        ...state,
        loadingUpdateNSFWDisplaySetting: false,
      };

    case FETCH_CURRENT_USER_SETTINGS.SUCCESS: {
      const displayNSFWContent = _.get(action.payload, 'display-nsfw-setting', false);
      const votingPercent = _.get(action.payload, 'vote-percent', 100);
      const enableVotingSlider = _.get(action.payload, 'vote-slider', false);
      const customTheme = _.get(action.payload, 'custom-theme', defaultCustomTheme);
      const compactViewEnabled = _.get(action.payload, 'post-preview-compact-mode', false);
      const languageSetting = _.get(action.payload, 'language-setting', 'en_US');
      const signature = _.get(action.payload, 'user-signature', '');
      const enableSignature = _.get(action.payload, 'user-signature-enabled', false);

      return {
        ...state,
        displayNSFWContent,
        enableVotingSlider,
        votingPercent,
        customTheme,
        compactViewEnabled,
        languageSetting,
        signature,
        enableSignature,
      };
    }

    case CURRENT_USER_REPORT_POST.ACTION:
      return {
        ...state,
        pendingReportingPosts: [...state.pendingReportingPosts, action.payload.id],
      };
    case CURRENT_USER_REPORT_POST.SUCCESS:
    case CURRENT_USER_REPORT_POST.LOADING_END:
    case CURRENT_USER_REPORT_POST.ERROR:
      return {
        ...state,
        pendingReportingPosts: _.remove(
          state.pendingReportingPosts,
          postID => postID !== action.payload,
        ),
      };

    case FETCH_REPORTED_POSTS.ACTION:
      return {
        ...state,
        loadingReportedPosts: true,
      };
    case FETCH_REPORTED_POSTS.SUCCESS: {
      const reportedPosts = _.map(action.payload, post => post);
      return {
        ...state,
        reportedPosts,
        loadingReportedPosts: false,
      };
    }
    case UPDATE_VOTING_SLIDER_SETTING.ACTION:
      return {
        ...state,
        loadingUpdateVotingSliderSetting: true,
      };
    case UPDATE_VOTING_SLIDER_SETTING.SUCCESS:
      return {
        ...state,
        enableVotingSlider: action.payload,
        loadingUpdateVotingSliderSetting: false,
      };
    case UPDATE_VOTING_SLIDER_SETTING.ERROR:
      return {
        ...state,
        loadingUpdateVotingSliderSetting: false,
      };

    case UPDATE_VOTING_PERCENT_SETTING.SUCCESS:
      return {
        ...state,
        votingPercent: action.payload,
      };
    case UPDATE_CUSTOM_THEME.SUCCESS: {
      const customTheme = {
        ...state.customTheme,
        ...action.payload,
      };
      return {
        ...state,
        customTheme,
      };
    }

    case UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS.ACTION:
      return {
        ...state,
        loadingUpdateCompactViewEnabled: true,
      };
    case UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS.SUCCESS:
      return {
        ...state,
        compactViewEnabled: action.payload,
        loadingUpdateCompactViewEnabled: false,
      };
    case UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS.ERROR:
    case UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS.LOADING_END:

    case UPDATE_USER_SIGNATURE.ACTION:
      return {
        ...state,
        loadingSavingSignature: true,
      };

    case UPDATE_USER_SIGNATURE.SUCCESS:
      return {
        ...state,
        loadingSavingSignature: false,
        signature: action.payload,
      };
    case UPDATE_USER_SIGNATURE.ERROR:
      return {
        ...state,
        loadingSavingSignature: false,
      };

    case UPDATE_ENABLE_USER_SIGNATURE.ACTION:
      return {
        ...state,
        loadingSavingEnableUserSignature: true,
      };

    case UPDATE_ENABLE_USER_SIGNATURE.SUCCESS:
      return {
        ...state,
        loadingSavingEnableUserSignature: false,
        enableSignature: action.payload,
      };
    case UPDATE_ENABLE_USER_SIGNATURE.ERROR:
      return {
        ...state,
        loadingSavingEnableUserSignature: false,
      };
    default:
      return state;
  }
};

export const getDisplayNSFWContent = state => state.displayNSFWContent;
export const getReportedPosts = state => state.reportedPosts;
export const getPendingReportingPosts = state => state.pendingReportingPosts;
export const getEnableVotingSlider = state => state.enableVotingSlider;
export const getVotingPercent = state => state.votingPercent;
export const getCustomTheme = state => state.customTheme;
export const getCompactViewEnabled = state => state.compactViewEnabled;
export const getLoadingUpdateCompactViewEnabled = state => state.loadingUpdateCompactViewEnabled;
export const getLoadingUpdateNSFWDisplaySetting = state => state.loadingUpdateNSFWDisplaySetting;
export const getLoadingUpdateVotingSliderSetting = state => state.loadingUpdateVotingSliderSetting;
export const getLanguageSetting = state => state.languageSetting;
export const getSignature = state => state.signature;
export const getLoadingSavingSignature = state => state.loadingSavingSignature;
export const getEnableSignature = state => state.enableSignature;
export const getLoadingSavingEnableUserSignature = state => state.loadingSavingEnableUserSignature;
