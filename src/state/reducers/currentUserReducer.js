import _ from 'lodash';
import {
  FETCH_CURRENT_USER_FEED,
  FETCH_MORE_CURRENT_USER_FEED,
  FETCH_CURRENT_USER_REBLOG_LIST,
  CURRENT_USER_REBLOG_POST,
  FETCH_CURRENT_USER_FOLLOW_LIST,
  FETCH_CURRENT_USER_BSTEEM_FEED,
  FETCH_MORE_CURRENT_USER_BSTEEM_FEED,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  currentUserFeed: [],
  loadingFetchCurrentUserFeed: false,
  loadingFetchMoreCurrentUserFeed: false,
  rebloggedList: [],
  followList: {},

  currentUserBSteemFeed: [],
  loadingFetchCurrentUserBSteemFeed: false,
  loadingFetchMoreCurrentBSteemUserFeed: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER_FEED.ACTION:
      return {
        ...state,
        loadingFetchCurrentUserFeed: true,
      };
    case FETCH_CURRENT_USER_FEED.SUCCESS:
      return {
        ...state,
        currentUserFeed: action.payload,
        loadingFetchCurrentUserFeed: false,
      };
    case FETCH_CURRENT_USER_FEED.ERROR:
      return {
        ...state,
        loadingFetchCurrentUserFeed: false,
      };
    case FETCH_MORE_CURRENT_USER_FEED.ACTION:
      return {
        ...state,
        loadingFetchMoreCurrentUserFeed: true,
      };
    case FETCH_MORE_CURRENT_USER_FEED.SUCCESS:
      return {
        ...state,
        currentUserFeed: state.currentUserFeed.concat(
          action.payload.slice(1, action.payload.length),
        ),
        loadingFetchMoreCurrentUserFeed: false,
      };
    case FETCH_MORE_CURRENT_USER_FEED.ERROR:
      return {
        ...state,
        loadingFetchMoreCurrentUserFeed: false,
      };
    case FETCH_CURRENT_USER_REBLOG_LIST.SUCCESS:
      return {
        ...state,
        rebloggedList: action.payload,
      };
    case CURRENT_USER_REBLOG_POST.SUCCESS:
      return {
        ...state,
        rebloggedList: state.rebloggedList.concat(`${action.payload.postId}`),
      };
    case FETCH_CURRENT_USER_FOLLOW_LIST.SUCCESS: {
      const formattedFollowList = _.reduce(
        action.payload,
        (obj, followDetails) => {
          obj[followDetails.following] = true;
          return obj;
        },
        {},
      );
      return {
        ...state,
        followList: formattedFollowList,
      };
    }

    case FETCH_CURRENT_USER_BSTEEM_FEED.Action:
      return {
        ...state,
        loadingFetchCurrentUserBSteemFeed: true,
      };

    case FETCH_CURRENT_USER_BSTEEM_FEED.SUCCESS:
      return {
        ...state,
        currentUserBSteemFeed: action.payload,
        loadingFetchCurrentUserBSteemFeed: false,
      };
    case FETCH_CURRENT_USER_BSTEEM_FEED.ERROR:
      return {
        ...state,
        loadingFetchCurrentUserBSteemFeed: false,
      };
    default:
      return state;
  }
};

export const getCurrentUserFeed = state => state.currentUserFeed;
export const getLoadingFetchCurrentUserFeed = state => state.loadingFetchCurrentUserFeed;
export const getLoadingFetchMoreCurrentUserFeed = state => state.loadingFetchMoreCurrentUserFeed;
export const getCurrentUserRebloggedList = state => state.rebloggedList;
export const getCurrentUserFollowList = state => state.followList;
export const getCurrentUserBSteemFeed = state => state.currentUserBSteemFeed;
export const getLoadingFetchCurrentUserBSteemFeed = state =>
  state.loadingFetchCurrentUserBSteemFeed;
export const getLoadingFetchMoreCurrentBSteemUserFeed = state =>
  state.loadingFetchMoreCurrentBSteemUserFeed;
