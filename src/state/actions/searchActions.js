import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  SEARCH_ASK_STEEM,
  SEARCH_FETCH_POST_DETAILS,
  SEARCH_FETCH_TAGS,
  SEARCH_FETCH_USERS,
  SEARCH_SET_TRENDING_TAGS,
} from './actionTypes';

export const searchAskSteem = createAsyncSagaAction(SEARCH_ASK_STEEM);
export const searchFetchPostDetails = createAsyncSagaAction(SEARCH_FETCH_POST_DETAILS);
export const searchFetchTags = createAsyncSagaAction(SEARCH_FETCH_TAGS);
export const searchFetchUsers = createAsyncSagaAction(SEARCH_FETCH_USERS);

export const setTrendingTags = payload => ({
  type: SEARCH_SET_TRENDING_TAGS,
  payload,
});
