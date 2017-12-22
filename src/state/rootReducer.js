import { combineReducers } from 'redux';
import homeReducer, * as fromHome from './reducers/homeReducer';
import authReducer, * as fromAuth from './reducers/authReducer';
import commentsReducer, * as fromComments from './reducers/commentsReducer';
import usersReducer, * as fromUsers from './reducers/usersReducer';
import searchReducer, * as fromSearch from './reducers/searchReducer';
import currentUserReducer, * as fromCurrentUser from './reducers/currentUserReducer';
import userActivityReducer, * as fromUserActivity from './reducers/userActivityReducer';

export default combineReducers({
  home: homeReducer,
  auth: authReducer,
  comments: commentsReducer,
  users: usersReducer,
  search: searchReducer,
  currentUser: currentUserReducer,
  userActivity: userActivityReducer,
});

// Home Selectors
export const getLoadingFetchDiscussions = state => fromHome.getLoadingFetchDiscussions(state.home);
export const getLoadingFetchMoreDiscussions = state =>
  fromHome.getLoadingFetchMoreDiscussions(state.home);
export const getHomeFeedPosts = state => fromHome.getHomeFeedPosts(state.home);

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

// Auth Selectors
export const getAuthUsername = state => fromAuth.getUsername(state.auth);
export const getAuthAccessToken = state => fromAuth.getAccessToken(state.auth);
export const getAuthExpiresIn = state => fromAuth.getExpiresIn(state.auth);
export const getIsAuthenticated = state => fromAuth.getIsAuthenticated(state.auth);

// Current User Selectors
export const getCurrentUserFeed = state => fromCurrentUser.getCurrentUserFeed(state.currentUser);
export const getLoadingFetchCurrentUserFeed = state =>
  fromCurrentUser.getLoadingFetchCurrentUserFeed(state.currentUser);
export const getLoadingFetchMoreCurrentUserFeed = state =>
  fromCurrentUser.getLoadingFetchMoreCurrentUserFeed(state.currentUser);
export const getCurrentUserRebloggedList = state =>
  fromCurrentUser.getCurrentUserRebloggedList(state.currentUser);
export const getCurrentUserFollowList = state =>
  fromCurrentUser.getCurrentUserFollowList(state.currentUser);

// User Activity Selectors
export const getUsersTransactions = state =>
  fromUserActivity.getUsersTransactions(state.userActivity);
export const getUsersAccountHistory = state =>
  fromUserActivity.getUsersAccountHistory(state.userActivity);
