import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_CURRENT_USER_FEED,
  FETCH_MORE_CURRENT_USER_FEED,
  FETCH_CURRENT_USER_REBLOG_LIST,
  CURRENT_USER_VOTE_POST,
  CURRENT_USER_REBLOG_POST,
  CURRENT_USER_ONBOARDING,
} from './actionTypes';

export const currentUserFeedFetch = createAsyncSagaAction(FETCH_CURRENT_USER_FEED);
export const currentUserFeedFetchMore = createAsyncSagaAction(FETCH_MORE_CURRENT_USER_FEED);
export const currentUserReblogListFetch = createAsyncSagaAction(FETCH_CURRENT_USER_REBLOG_LIST);

export const currentUserVotePost = createAsyncSagaAction(CURRENT_USER_VOTE_POST);
export const currentUserReblogPost = createAsyncSagaAction(CURRENT_USER_REBLOG_POST);

export const currentUserOnboarding = createAsyncSagaAction(CURRENT_USER_ONBOARDING);
