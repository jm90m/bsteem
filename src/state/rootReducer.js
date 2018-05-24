import { combineReducers } from 'redux';
import homeReducer, * as fromHome from './reducers/homeReducer';
import authReducer, * as fromAuth from './reducers/authReducer';
import commentsReducer, * as fromComments from './reducers/commentsReducer';
import usersReducer, * as fromUsers from './reducers/usersReducer';
import searchReducer, * as fromSearch from './reducers/searchReducer';
import currentUserReducer, * as fromCurrentUser from './reducers/currentUserReducer';
import userActivityReducer, * as fromUserActivity from './reducers/userActivityReducer';
import appReducer, * as fromApp from './reducers/appReducer';
import editorReducer, * as fromEditor from './reducers/editorReducer';
import firebaseReducer, * as fromFirebase from './reducers/firebaseReducer';
import postsReducer, * as fromPosts from './reducers/postsReducer';
import settingsReducer, * as fromSettings from './reducers/settingsReducer';
import messagesReducer, * as fromMessages from './reducers/messagesReducer';
import intlReducer, * as fromIntl from './reducers/intlReducer';

export default combineReducers({
  app: appReducer,
  home: homeReducer,
  auth: authReducer,
  comments: commentsReducer,
  users: usersReducer,
  search: searchReducer,
  currentUser: currentUserReducer,
  userActivity: userActivityReducer,
  editor: editorReducer,
  firebase: firebaseReducer,
  posts: postsReducer,
  settings: settingsReducer,
  messages: messagesReducer,
  intl: intlReducer,
});

// Home Selectors
export const getLoadingFetchDiscussions = state => fromHome.getLoadingFetchDiscussions(state.home);
export const getLoadingFetchMoreDiscussions = state =>
  fromHome.getLoadingFetchMoreDiscussions(state.home);
export const getHomeFeedPosts = state => fromHome.getHomeFeedPosts(state.home);
export const getHomeTags = state => fromHome.getHomeTags(state.home);
export const getFilterFeedByFollowers = state => fromHome.getFilterFeedByFollowers(state.home);
export const getTagsLoading = state => fromHome.getTagsLoading(state.home);

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
export const getRefreshUserBlogLoading = state => fromUsers.getRefreshUserBlogLoading(state.users);

// Search Selectors
export const getAllTrendingTags = state => fromSearch.getAllTrendingTags(state.search);
export const getSearchUsersResults = state => fromSearch.getSearchUserResults(state.search);
export const getSearchPostsResults = state => fromSearch.getSearchPostResults(state.search);
export const getSearchTagsResults = state => fromSearch.getSearchTagsResults(state.search);
export const getLoadingSearchUser = state => fromSearch.getLoadingSearchUser(state.search);
export const getLoadingSearchPost = state => fromSearch.getLoadingSearchPost(state.search);
export const getLoadingSearchTag = state => fromSearch.getLoadingSearchTag(state.search);

// Auth Selectors
export const getAuthUsername = state => fromAuth.getUsername(state.auth);
export const getAuthAccessToken = state => fromAuth.getAccessToken(state.auth);
export const getAuthExpiresIn = state => fromAuth.getExpiresIn(state.auth);
export const getIsAuthenticated = state => fromAuth.getIsAuthenticated(state.auth);
export const getAuthenticatedUserSCMetaData = state =>
  fromAuth.getAuthenticatedUserSCMetaData(state.auth);
export const getCurrentUserNavigation = state => fromAuth.getCurrentUserNavigation(state.auth);

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
export const getCurrentUserBSteemFeed = state =>
  fromCurrentUser.getCurrentUserBSteemFeed(state.currentUser);
export const getLoadingFetchCurrentUserBSteemFeed = state =>
  fromCurrentUser.getLoadingFetchCurrentUserBSteemFeed(state.currentUser);
export const getLoadingFetchMoreCurrentBSteemUserFeed = state =>
  fromCurrentUser.getLoadingFetchMoreCurrentBSteemUserFeed(state.currentUser);
export const getNotifications = state => fromCurrentUser.getNotifications(state.currentUser);
export const getLoadingNotifications = state =>
  fromCurrentUser.getLoadingNotifications(state.currentUser);

// User Activity Selectors
export const getUsersTransactions = state =>
  fromUserActivity.getUsersTransactions(state.userActivity);
export const getUsersAccountHistory = state =>
  fromUserActivity.getUsersAccountHistory(state.userActivity);
export const getLoadingFetchUserAccountHistory = state =>
  fromUserActivity.getLoadingFetchUserAccountHistory(state.userActivity);
export const getLoadingFetchMoreUserAccountHistory = state =>
  fromUserActivity.getLoadingFetchMoreUserAccountHistory(state.userActivity);
export const getUserTransferHistory = state =>
  fromUserActivity.getUserTransferHistory(state.userActivity);
export const getLoadingFetchUserTransferHistory = state =>
  fromUserActivity.getLoadingFetchUserTransferHistory(state.userActivity);

// App Selectors
export const getSteemRate = state => fromApp.getSteemRate(state.app);
export const getLoadingSteemGlobalProperties = state =>
  fromApp.getLoadingSteemGlobalProperties(state.app);
export const getTotalVestingFundSteem = state => fromApp.getTotalVestingFundSteem(state.app);
export const getTotalVestingShares = state => fromApp.getTotalVestingShares(state.app);
export const getHasNetworkConnection = state => fromApp.getHasNetworkConnection(state.app);
export const getSteemConnectDisplayErrorModal = state =>
  fromApp.getSteemConnectDisplayErrorModal(state.app);
export const getDisplayNotifyModal = state => fromApp.getDisplayNotifyModal(state.app);
export const getNotifyTitle = state => fromApp.getNotifyTitle(state.app);
export const getNotifyDescription = state => fromApp.getNotifyDescription(state.app);
export const getIsAppLoading = state => fromApp.getIsAppLoading(state.app);
export const getCryptosPriceHistory = state => fromApp.getCryptosPriceHistory(state.app);
export const getDisplayPriceModal = state => fromApp.getDisplayPriceModal(state.app);
export const getDisplayedCryptos = state => fromApp.getDisplayedCryptos(state.app);
export const getRewardFund = state => fromApp.getRewardFund(state.app);
export const getInitialAppLoaded = state => fromApp.getInitialAppLoaded(state.app);

// Comments Selectors
export const getCommentsByPostId = state => fromComments.getCommentsByPostId(state.comments);
export const getLoadingComments = state => fromComments.getLoadingComments(state.comments);

// Editor Selectors
export const getCreatePostLoading = state => fromEditor.getCreatePostLoading(state.editor);

// Firebase Selectors
export const getLoadingSavedTags = state => fromFirebase.getLoadingSavedTags(state.firebase);
export const getLoadingSavedPosts = state => fromFirebase.getLoadingSavedPosts(state.firebase);
export const getLoadingSavedUsers = state => fromFirebase.getLoadingSavedUsers(state.firebase);
export const getSavedTags = state => fromFirebase.getSavedTags(state.firebase);
export const getSavedPosts = state => fromFirebase.getSavedPosts(state.firebase);
export const getSavedUsers = state => fromFirebase.getSavedUsers(state.firebase);
export const getPendingSavingTags = state => fromFirebase.getPendingSavingTags(state.firebase);
export const getPendingSavingPosts = state => fromFirebase.getPendingSavingPosts(state.firebase);
export const getPendingSavingUsers = state => fromFirebase.getPendingSavingUsers(state.firebase);
export const getDrafts = state => fromFirebase.getDrafts(state.firebase);
export const getLoadingDrafts = state => fromFirebase.getLoadingDrafts(state.firebase);
export const getLoadingSavingDraft = state => fromFirebase.getLoadingSavingDraft(state.firebase);

// Posts Selectors
export const getPostsDetails = state => fromPosts.getPostsDetails(state.posts);
export const getPostLoading = state => fromPosts.getPostLoading(state.posts);
export const getSavedOfflinePosts = state => fromPosts.getSavedOfflinePosts(state.posts);
export const getPendingSavingPostsOffline = state =>
  fromPosts.getPendingSavingPostsOffline(state.posts);

// Settings Selectors
export const getDisplayNSFWContent = state => fromSettings.getDisplayNSFWContent(state.settings);
export const getCompactViewEnabled = state => fromSettings.getCompactViewEnabled(state.settings);
export const getReportedPosts = state => fromSettings.getReportedPosts(state.settings);
export const getPendingReportingPosts = state =>
  fromSettings.getPendingReportingPosts(state.settings);
export const getEnableVotingSlider = state => fromSettings.getEnableVotingSlider(state.settings);
export const getVotingPercent = state => fromSettings.getVotingPercent(state.settings);
export const getCustomTheme = state => fromSettings.getCustomTheme(state.settings);
export const getLoadingUpdateCompactViewEnabled = state =>
  fromSettings.getLoadingUpdateCompactViewEnabled(state.settings);
export const getLoadingUpdateNSFWDisplaySetting = state =>
  fromSettings.getLoadingUpdateNSFWDisplaySetting(state.settings);
export const getLoadingUpdateVotingSliderSetting = state =>
  fromSettings.getLoadingUpdateVotingSliderSetting(state.settings);
export const getLanguageSetting = state => fromSettings.getLanguageSetting(state.settings);
export const getSignature = state => fromSettings.getSignature(state.settings);
export const getLoadingSavingSignature = state =>
  fromSettings.getLoadingSavingSignature(state.settings);
export const getEnableSignature = state => fromSettings.getEnableSignature(state.settings);
export const getLoadingSavingEnableUserSignature = state =>
  fromSettings.getLoadingSavingEnableUserSignature(state.settings);

// Messages Selectors
export const getLoadingFetchMessages = state =>
  fromMessages.getLoadingFetchMessages(state.messages);
export const getMessages = state => fromMessages.getMessages(state.messages);
export const getMessagesSearchUserResults = state =>
  fromMessages.getMessagesSearchUserResults(state.messages);
export const getLoadingMessagesSearchUserResults = state =>
  fromMessages.getLoadingMessagesSearchUserResults(state.messages);
export const getUserMessages = (state, username) =>
  fromMessages.getUserMessages(state.messages, username);
export const getDisplayedMessages = state => fromMessages.getDisplayedMessages(state.messages);
export const getBlockedUsers = state => fromMessages.getBlockedUsers(state.messages);

// Intl Selector
export const getIntl = state => state.intl;
