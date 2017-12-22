import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_USER,
  FETCH_USER_COMMENTS,
  FETCH_USER_BLOG,
  FETCH_USER_FOLLOW_COUNT,
  REFRESH_USER_BLOG,
} from './actionTypes';

export const fetchUser = createAsyncSagaAction(FETCH_USER);
export const fetchUserComments = createAsyncSagaAction(FETCH_USER_COMMENTS);
export const fetchUserBlog = createAsyncSagaAction(FETCH_USER_BLOG);
export const fetchUserFollowCount = createAsyncSagaAction(FETCH_USER_FOLLOW_COUNT);
export const refreshUserBlog = createAsyncSagaAction(REFRESH_USER_BLOG);
