import _ from 'lodash';
import {
  FETCH_CURRENT_USER_SETTINGS,
  UPDATE_NSFW_DISPLAY_SETTING,
  CURRENT_USER_REPORT_POST,
  FETCH_REPORTED_POSTS,
  UPDATE_VOTING_SLIDER_SETTING,
  UPDATE_VOTING_PERCENT_SETTING,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  displayNSFWContent: false,
  reportedPosts: [],
  pendingReportingPosts: [],
  loadingReportedPosts: false,
  enableVotingSlider: false,
  votingPercent: 100,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_NSFW_DISPLAY_SETTING.SUCCESS:
      return {
        ...state,
        displayNSFWContent: action.payload,
      };
    case FETCH_CURRENT_USER_SETTINGS.SUCCESS: {
      const displayNSFWContent = _.get(action.payload, 'display-nsfw-setting', false);
      const votingPercent = _.get(action.payload, 'vote-percent', 100);
      const enableVotingSlider = _.get(action.payload, 'vote-slider', false);
      return {
        ...state,
        displayNSFWContent,
        enableVotingSlider,
        votingPercent,
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
    case UPDATE_VOTING_SLIDER_SETTING.SUCCESS:
      return {
        ...state,
        enableVotingSlider: action.payload,
      };
    case UPDATE_VOTING_PERCENT_SETTING.SUCCESS:
      return {
        ...state,
        votingPercent: action.payload,
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
