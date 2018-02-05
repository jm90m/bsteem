import { createAsyncSagaAction } from 'util/reduxUtils';
import { FETCH_COMMENTS, FETCH_POST_DETAILS } from './actionTypes';

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
