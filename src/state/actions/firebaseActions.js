import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_SAVED_TAGS,
  SAVE_TAG,
  UNSAVE_TAG,
  SAVE_POST,
  UNSAVE_POST,
  FETCH_SAVED_POSTS,
} from './actionTypes';

export const fetchSavedTags = createAsyncSagaAction(FETCH_SAVED_TAGS);
export const saveTag = createAsyncSagaAction(SAVE_TAG);
export const unsaveTag = createAsyncSagaAction(UNSAVE_TAG);
export const fetchSavedPosts = createAsyncSagaAction(FETCH_SAVED_POSTS);
export const savePost = createAsyncSagaAction(SAVE_POST);
export const unsavePost = createAsyncSagaAction(UNSAVE_POST);
