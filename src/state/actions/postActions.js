import { FETCH_COMMENTS } from './actionTypes';

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
