import {
  FETCH_USER,
  FETCH_USER_COMMENTS,
  FETCH_USER_BLOG,
  FETCH_USER_FOLLOW_COUNT,
} from '../actions/actionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
  usersDetails: {}, // username: userDetails
  usersComments: {}, // username: usersComments
  usersBlog: {}, // username: usersBlog
  usersFollowCount: {}, // username: usersFollowCount
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER.SUCCESS: {
      const user = _.head(action.payload);
      return {
        ...state,
        usersDetails: {
          ...state.usersDetails,
          [user.name]: user,
        },
      };
    }
    case FETCH_USER_COMMENTS.SUCCESS: {
      const userComments = state.usersComments[action.payload.username] || [];
      return {
        ...state,
        usersComments: {
          ...state.usersComments,
          [action.payload.username]: _.concat(userComments, action.payload.result),
        },
      };
    }
    case FETCH_USER_BLOG.SUCCESS: {
      const userBlog = state.usersBlog[action.payload.username] || [];
      return {
        ...state,
        usersBlog: {
          ...state.usersBlog,
          [action.payload.username]: _.concat(userBlog, action.payload.result),
        },
      };
    }
    case FETCH_USER_FOLLOW_COUNT.SUCCESS:
      return {
        ...state,
        usersFollowCount: {
          ...state.usersFollowCount,
          [action.payload.username]: action.payload.result,
        },
      };
    default:
      return state;
  }
};

export const getUsersDetails = state => state.usersDetails;
export const getUsersComments = state => state.usersComments;
export const getUsersBlog = state => state.usersBlog;
export const getUsersFollowCount = state => state.usersFollowCount;
