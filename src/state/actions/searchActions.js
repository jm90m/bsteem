import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  SEARCH_FETCH_POSTS,
  SEARCH_FETCH_TAGS,
  SEARCH_FETCH_USERS,
  SEARCH_SET_TRENDING_TAGS,
} from './actionTypes';

export const searchFetchPosts = createAsyncSagaAction(SEARCH_FETCH_POSTS);
export const searchFetchTags = createAsyncSagaAction(SEARCH_FETCH_TAGS);
export const searchFetchUsers = createAsyncSagaAction(SEARCH_FETCH_USERS);

export const setTrendingTags = payload => ({
  type: SEARCH_SET_TRENDING_TAGS,
  payload,
});
