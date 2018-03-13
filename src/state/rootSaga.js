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

const rootSaga = function*() {
  yield all([
    // Home Sagas
    spawn(homeSaga.watchFetchDiscussions),
    spawn(homeSaga.watchFetchMoreDiscussions),
    spawn(homeSaga.watchFetchTags),

    // Posts Sagas
    spawn(postsSaga.watchFetchComments),
    spawn(postsSaga.watchFetchPostDetails),

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

    // User Activity Sagas
    spawn(userActivitySaga.watchFetchUserAccountHistory),
    spawn(userActivitySaga.watchFetchMoreUserAccountHistory),

    // App Sagas
    spawn(appSaga.watchFetchSteemGlobalProperties),
    spawn(appSaga.watchFetchSteemRate),
    spawn(appSaga.watchFetchNetworkConnection),
    spawn(appSaga.watchSetTranslations),
    spawn(appSaga.watchAppOnboarding),
    spawn(appSaga.watchFetchCryptoPriceHistory),

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

    // Auth Sagas
    spawn(authSaga.watchAuthenticateUser),

    // Settings Sagas
    spawn(settingsSaga.watchFetchUserSettings),
    spawn(settingsSaga.watchSaveNSFWDisplaySetting),
    spawn(settingsSaga.watchReportPost),
    spawn(settingsSaga.watchUnreportPost),
    spawn(settingsSaga.watchFetchReportedPosts),
  ]);
};

export default rootSaga;
