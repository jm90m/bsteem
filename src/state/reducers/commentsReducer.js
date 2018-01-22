import _ from 'lodash';
import { FETCH_COMMENTS } from '../actions/actionTypes';

const INITIAL_STATE = {
  commentsByPostId: {},
  comments: {},
  pendingVotes: [],
  isLoading: false,
};

const mapCommentsBasedOnId = commentData =>
  _.reduce(
    commentData,
    (commentsMap, comment) => {
      // eslint-disable-next-line
      commentsMap[comment.id] = comment;
      return commentsMap;
    },
    {},
  );

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COMMENTS.PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_COMMENTS.SUCCESS: {
      const { content, postId } = action.payload;
      const comments = mapCommentsBasedOnId(content);
      console.log('COMMENTS', comments);
      return {
        ...state,
        commentsByPostId: {
          [postId]: comments,
        },
        isLoading: false,
      };
    }
    case FETCH_COMMENTS.ERROR:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const getCommentsByPostId = state => state.commentsByPostId;
