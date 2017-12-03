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

export const fetchCommentsSuccess = (rootsCommentsList, commentsChildrenList, content, postId) => ({
  type: FETCH_COMMENTS.SUCCESS,
  payload: {
    rootsCommentsList,
    commentsChildrenList,
    content,
    postId,
  },
});

export const fetchCommentsFail = error => ({
  type: FETCH_COMMENTS.ERROR,
  error,
});
