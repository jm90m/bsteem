import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_COMMENTS,
  FETCH_POST_DETAILS,
  SAVE_POST_OFFLINE,
  UNSAVE_POST_OFFLINE,
  FETCH_SAVED_OFFLINE_POSTS,
  ADD_POST_TO_SAVED_OFFLINE,
  REMOVE_POST_SAVED_OFFLINE,
  ADD_POSTS_TO_POST_MAP,
} from './actionTypes';

export const fetchComments = (category, author, permlink, postId) => ({
  type: FETCH_COMMENTS.PENDING,
  payload: {
    category,
    author,
    permlink,
    postId,
  },
});

export const fetchCommentsSuccess = (content, postId) => ({
  type: FETCH_COMMENTS.SUCCESS,
  payload: {
    content,
    postId,
  },
});

export const fetchCommentsFail = error => ({
  type: FETCH_COMMENTS.ERROR,
  error,
});

export const fetchPostDetails = createAsyncSagaAction(FETCH_POST_DETAILS);
export const savePostOffline = createAsyncSagaAction(SAVE_POST_OFFLINE);
export const unsavePostOffline = createAsyncSagaAction(UNSAVE_POST_OFFLINE);
export const fetchSavedOfflinePosts = createAsyncSagaAction(FETCH_SAVED_OFFLINE_POSTS);
export const addPostToSavedOffline = postDataString => ({
  type: ADD_POST_TO_SAVED_OFFLINE,
  payload: {
    postDataString,
  },
});
export const removePostSavedOffline = payload => ({
  type: REMOVE_POST_SAVED_OFFLINE,
  payload,
});

export const addPostsToPostMap = payload => ({
  type: ADD_POSTS_TO_POST_MAP,
  payload,
});
