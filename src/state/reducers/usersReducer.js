import _ from 'lodash';
import {
  FETCH_USER,
  FETCH_USER_COMMENTS,
  FETCH_USER_BLOG,
  FETCH_USER_FOLLOW_COUNT,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  usersDetails: {}, // username: userDetails
  usersComments: {}, // username: usersComments
  usersBlog: {}, // username: usersBlog
  usersFollowCount: {}, // username: usersFollowCount
  loadingUsersBlog: false,
  loadingUsersComments: false,
  loadingUsersDetails: false,
  loadingUsersFollowCount: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER.ACTION:
      return {
        ...state,
        loadingUsersDetails: true,
      };
    case FETCH_USER.SUCCESS: {
      const user = _.head(action.payload);
      return {
        ...state,
        usersDetails: {
          ...state.usersDetails,
          [user.name]: user,
        },
        loadingUsersDetails: false,
      };
    }
    case FETCH_USER.ERROR:
      return {
        ...state,
        loadingUsersDetails: false,
      };
    case FETCH_USER_COMMENTS.ACTION:
      return {
        ...state,
        loadingUsersComments: true,
      };
    case FETCH_USER_COMMENTS.SUCCESS: {
      const userComments = state.usersComments[action.payload.username] || [];
      const newUserComments = _.uniqBy(_.concat(userComments, action.payload.result), 'id');
      return {
        ...state,
        usersComments: {
          ...state.usersComments,
          [action.payload.username]: newUserComments,
        },
        loadingUsersComments: false,
      };
    }
    case FETCH_USER_COMMENTS.ERROR:
      return {
        ...state,
        loadingUsersComments: false,
      };
    case FETCH_USER_BLOG.ACTION:
      return {
        ...state,
        loadingUsersBlog: true,
      };
    case FETCH_USER_BLOG.SUCCESS: {
      const userBlog = state.usersBlog[action.payload.username] || [];
      const newUserBlog = _.uniqBy(_.concat(userBlog, action.payload.result), 'id');
      return {
        ...state,
        usersBlog: {
          ...state.usersBlog,
          [action.payload.username]: newUserBlog,
        },
        loadingUsersBlog: false,
      };
    }
    case FETCH_USER_BLOG.ERROR:
      return {
        ...state,
        loadingUsersBlog: false,
      };
    case FETCH_USER_FOLLOW_COUNT.ACTION:
      return {
        ...state,
        loadingUsersFollowCount: true,
      };
    case FETCH_USER_FOLLOW_COUNT.SUCCESS:
      return {
        ...state,
        usersFollowCount: {
          ...state.usersFollowCount,
          [action.payload.username]: action.payload.result,
        },
        loadingUsersFollowCount: false,
      };
    case FETCH_USER_FOLLOW_COUNT.ERROR:
      return {
        ...state,
        loadingUsersFollowCount: false,
      };
    default:
      return state;
  }
};

export const getUsersDetails = state => state.usersDetails;
export const getUsersComments = state => state.usersComments;
export const getUsersBlog = state => state.usersBlog;
export const getUsersFollowCount = state => state.usersFollowCount;
export const getLoadingUsersBlog = state => state.loadingUsersBlog;
export const getLoadingUsersComments = state => state.loadingUsersComments;
export const getLoadingUsersDetails = state => state.loadingUsersDetails;
export const getLoadingUsersFollowCount = state => state.loadingUsersFollowCount;
