import { combineReducers } from 'redux';
import homeReducer, * as fromHome from './reducers/homeReducer';
import authReducer, * as fromAuth from './reducers/authReducer';
import commentsReducer, * as fromComments from './reducers/commentsReducer';
import usersReducer, * as fromUsers from './reducers/usersReducer';
import searchReducer, * as fromSearch from './reducers/searchReducer';

export default combineReducers({
  home: homeReducer,
  auth: authReducer,
  comments: commentsReducer,
  users: usersReducer,
  search: searchReducer,
});

// User Selectors
export const getUsersDetails = state => fromUsers.getUsersDetails(state.users);
export const getUsersComments = state => fromUsers.getUsersComments(state.users);
export const getUsersBlog = state => fromUsers.getUsersBlog(state.users);
export const getUsersFollowCount = state => fromUsers.getUsersFollowCount(state.users);
export const getLoadingUsersBlog = state => fromUsers.getLoadingUsersBlog(state.users);
export const getLoadingUsersComments = state => fromUsers.getLoadingUsersComments(state.users);
export const getLoadingUsersDetails = state => fromUsers.getLoadingUsersDetails(state.users);
export const getLoadingUsersFollowCount = state =>
  fromUsers.getLoadingUsersFollowCount(state.users);

// Search Selectors
export const getSearchLoading = state => fromSearch.getSearchLoading(state.search);
export const getSearchResults = state => fromSearch.getSearchResults(state.search);
export const getCurrentSearchedPosts = state => fromSearch.getCurrentSearchedPosts(state.search);
export const getSearchFetchPostLoading = state =>
  fromSearch.getSearchFetchPostLoading(state.search);
