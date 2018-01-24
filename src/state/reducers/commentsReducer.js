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

const getCommentsChildrenLists = content => {
  const listsById = {};

  _.keys(content).forEach(commentKey => {
    listsById[content[commentKey].id] = content[commentKey].replies.map(
      childKey => content[childKey].id,
    );
  });

  return listsById;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COMMENTS.PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_COMMENTS.SUCCESS: {
      const { content, postId } = action.payload;
      console.log('CONTENT FROM COMMENTS REQUEST', content);
      const comments = mapCommentsBasedOnId(content);
      const childrenById = getCommentsChildrenLists(content);
      console.log('COMMENTS', comments);
      console.log('CHILDREN_BY_ID', childrenById);
      return {
        ...state,
        commentsByPostId: {
          [postId]: {
            comments,
            childrenById,
            isFetching: false,
            pendingVotes: [],
          },
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
