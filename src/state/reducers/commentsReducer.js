import _ from 'lodash';
import { FETCH_COMMENTS } from '../actions/actionTypes';

const INITIAL_STATE = {
  commentsByPostId: {},
  comments: {},
  pendingVotes: [],
  loading: false,
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
        loading: true,
      };
    case FETCH_COMMENTS.SUCCESS: {
      const { content, postId } = action.payload;
      const comments = mapCommentsBasedOnId(content);
      const childrenById = getCommentsChildrenLists(content);
      const oldPostCommentsDetails = _.get(state.commentsByPostId, postId, {});
      return {
        ...state,
        commentsByPostId: {
          [postId]: {
            ...oldPostCommentsDetails,
            comments,
            childrenById,
            isFetching: false,
            pendingVotes: [],
          },
        },
        loading: false,
      };
    }
    case FETCH_COMMENTS.ERROR:
    case FETCH_COMMENTS.LOADING_END:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export const getCommentsByPostId = state => state.commentsByPostId;
export const getLoadingComments = state => state.loading;
