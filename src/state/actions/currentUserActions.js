import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_CURRENT_USER_FEED,
  FETCH_MORE_CURRENT_USER_FEED,
  FETCH_CURRENT_USER_BSTEEM_FEED,
  FETCH_MORE_CURRENT_USER_BSTEEM_FEED,
  FETCH_CURRENT_USER_REBLOG_LIST,
  CURRENT_USER_VOTE_POST,
  CURRENT_USER_REBLOG_POST,
  CURRENT_USER_ONBOARDING,
  FETCH_CURRENT_USER_FOLLOW_LIST,
  CURRENT_USER_FOLLOW_USER,
  CURRENT_USER_UNFOLLOW_USER,
  CURRENT_USER_VOTE_COMMENT,
} from './actionTypes';

export const currentUserFeedFetch = createAsyncSagaAction(FETCH_CURRENT_USER_FEED);
export const currentUserFollowListFetch = createAsyncSagaAction(FETCH_CURRENT_USER_FOLLOW_LIST);
export const currentUserFeedFetchMore = createAsyncSagaAction(FETCH_MORE_CURRENT_USER_FEED);
export const currentUserReblogListFetch = createAsyncSagaAction(FETCH_CURRENT_USER_REBLOG_LIST);
export const currentUserBSteemFeedFetch = createAsyncSagaAction(FETCH_CURRENT_USER_BSTEEM_FEED);
export const currentUserBSteemFeedFetchMore = createAsyncSagaAction(
  FETCH_MORE_CURRENT_USER_BSTEEM_FEED,
);

export const currentUserVotePost = createAsyncSagaAction(CURRENT_USER_VOTE_POST);
export const currentUserVoteComment = createAsyncSagaAction(CURRENT_USER_VOTE_COMMENT);
export const currentUserReblogPost = createAsyncSagaAction(CURRENT_USER_REBLOG_POST);
export const currentUserFollowUser = createAsyncSagaAction(CURRENT_USER_FOLLOW_USER);
export const currentUserUnfollowUser = createAsyncSagaAction(CURRENT_USER_UNFOLLOW_USER);

export const currentUserOnboarding = createAsyncSagaAction(CURRENT_USER_ONBOARDING);
