import { spawn, all } from 'redux-saga/effects';
import * as homeSaga from './sagas/homeSaga';
import * as postsSaga from './sagas/postsSaga';
import * as usersSaga from './sagas/usersSaga';
import * as searchSaga from './sagas/searchSaga';
import * as currentUserSaga from './sagas/currentUserSaga';
import * as userActivitySaga from './sagas/userActivitySaga';
import * as appSaga from './sagas/appSaga';
import * as editorSaga from './sagas/editorSaga';
import * as firebaseSaga from './sagas/firebaseSaga';
import * as authSaga from './sagas/authSaga';
import * as settingsSaga from './sagas/settingsSaga';
import * as messagesSaga from './sagas/messagesSaga';

const rootSaga = function*(busyAPI) {
  yield all([
    // Home Sagas
    spawn(homeSaga.watchFetchDiscussions),
    spawn(homeSaga.watchFetchMoreDiscussions),
    spawn(homeSaga.watchFetchTags),

    // Posts Sagas
    spawn(postsSaga.watchFetchComments),
    spawn(postsSaga.watchFetchPostDetails),
    spawn(postsSaga.watchSavePostOffline),
    spawn(postsSaga.watchFetchSavedOfflinePosts),
    spawn(postsSaga.watchUnsavePostOffline),

    // User Sagas
    spawn(usersSaga.watchFetchUser),
    spawn(usersSaga.watchFetchUserBlog),
    spawn(usersSaga.watchFetchUserComments),
    spawn(usersSaga.watchFetchUserFollowCount),
    spawn(usersSaga.watchRefreshUserBlog),

    // Search Sagas
    spawn(searchSaga.watchFetchPostsSearchResults),
    spawn(searchSaga.watchFetchUsersSearchResults),
    spawn(searchSaga.watchFetchTagsSearchResults),

    // Current User Sagas
    spawn(currentUserSaga.watchFetchCurrentUserFeed),
    spawn(currentUserSaga.watchFetchMoreCurrentUserFeed),
    spawn(currentUserSaga.watchCurrentUserVotePost),
    spawn(currentUserSaga.watchCurrentUserVoteComment),
    spawn(currentUserSaga.watchCurrentUserReblogPost),
    spawn(currentUserSaga.watchCurrentUserOnboarding),
    spawn(currentUserSaga.watchCurrentUserFollowList),
    spawn(currentUserSaga.watchCurrentUserFollowUser),
    spawn(currentUserSaga.watchCurrentUserUnfollowUser),
    spawn(currentUserSaga.watchFetchCurrentUserRebloggedList),
    spawn(currentUserSaga.watchFetchCurrentUserBSteemFeed),
    spawn(currentUserSaga.watchFetchMoreCurrentUserBsteemFeed),

    // User Activity Sagas
    spawn(userActivitySaga.watchFetchUserAccountHistory),
    spawn(userActivitySaga.watchFetchMoreUserAccountHistory),
    spawn(userActivitySaga.watchFetchUserTransferHistory),

    // App Sagas
    spawn(appSaga.watchFetchSteemGlobalProperties),
    spawn(appSaga.watchFetchSteemRate),
    spawn(appSaga.watchFetchNetworkConnection),
    spawn(appSaga.watchAppOnboarding),
    spawn(appSaga.watchFetchCryptoPriceHistory),
    spawn(appSaga.watchFetchRewardFund),

    // Editor Sagas
    spawn(editorSaga.watchCreatePost),
    spawn(editorSaga.watchUploadImage),
    spawn(editorSaga.watchCreateComment),

    // Firebase Sagas
    spawn(firebaseSaga.watchFetchSavedTags),
    spawn(firebaseSaga.watchSaveTag),
    spawn(firebaseSaga.watchUnsaveTag),
    spawn(firebaseSaga.watchFetchSavedPosts),
    spawn(firebaseSaga.watchSavePost),
    spawn(firebaseSaga.watchUnsavePost),
    spawn(firebaseSaga.watchFetchSavedUsers),
    spawn(firebaseSaga.watchSaveUser),
    spawn(firebaseSaga.watchUnsaveUser),
    spawn(firebaseSaga.watchSaveDraft),
    spawn(firebaseSaga.watchDeleteDraft),
    spawn(firebaseSaga.watchFetchDrafts),

    // Auth Sagas
    spawn(authSaga.watchAuthenticateUser, busyAPI),
    spawn(authSaga.watchFetchSteemConnectAuthUserData),
    spawn(authSaga.watchSaveNotificationsLastTimestamp),
    spawn(authSaga.watchFetchNotifications, busyAPI),
    spawn(authSaga.watchLogoutUser),

    // Settings Sagas
    spawn(settingsSaga.watchFetchUserSettings),
    spawn(settingsSaga.watchSaveNSFWDisplaySetting),
    spawn(settingsSaga.watchReportPost),
    spawn(settingsSaga.watchUnreportPost),
    spawn(settingsSaga.watchFetchReportedPosts),
    spawn(settingsSaga.watchUpdateVotingSliderSetting),
    spawn(settingsSaga.watchUpdateVotingPercentSetting),
    spawn(settingsSaga.watchUpdateCustomTheme),
    spawn(settingsSaga.watchSavePostPreviewSetting),
    spawn(settingsSaga.watchUpdateUserLanguageSetting),
    spawn(settingsSaga.watchUpdateUserSignature),
    spawn(settingsSaga.watchUpdateEnableUserSignature),

    // Messages Sagas
    spawn(messagesSaga.watchFetchDisplayedMessages),
    spawn(messagesSaga.watchSearchUserMessages),
    spawn(messagesSaga.watchSendMessage),
    spawn(messagesSaga.watchFetchCurrentMessage),
    spawn(messagesSaga.watchFetchBlockedUsers),
    spawn(messagesSaga.watchBlockUser),
    spawn(messagesSaga.watchUnblockUser),
    spawn(messagesSaga.watchHideDisplayedUserMessage),
  ]);
};

export default rootSaga;
