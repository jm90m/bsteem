import { combineReducers } from 'redux';
import homeReducer, * as fromHome from './reducers/homeReducer';
import authReducer, * as fromAuth from './reducers/authReducer';
import commentsReducer, * as fromComments from './reducers/commentsReducer';
import usersReducer, * as fromUsers from './reducers/usersReducer';

export default combineReducers({
  home: homeReducer,
  auth: authReducer,
  comments: commentsReducer,
  users: usersReducer,
});

// selectors
export const getUsersDetails = state => fromUsers.getUsersDetails(state.users);
export const getUsersComments = state => fromUsers.getUsersComments(state.users);
export const getUsersBlog = state => fromUsers.getUsersBlog(state.users);
export const getUsersFollowCount = state => fromUsers.getUsersFollowCount(state.users);
export const getLoadingUsersBlog = state => fromUsers.getLoadingUsersBlog(state.users);
export const getLoadingUsersComments = state => fromUsers.getLoadingUsersComments(state.users);
export const getLoadingUsersDetails = state => fromUsers.getLoadingUsersDetails(state.users);
export const getLoadingUsersFollowCount = state =>
  fromUsers.getLoadingUsersFollowCount(state.users);
