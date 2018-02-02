import { spawn, all } from 'redux-saga/effects';
import * as homeSaga from './sagas/homeSaga';
import * as postSaga from './sagas/postSaga';
import * as usersSaga from './sagas/usersSaga';
import * as searchSaga from './sagas/searchSaga';
import * as currentUserSaga from './sagas/currentUserSaga';
import * as userActivitySaga from './sagas/userActivitySaga';
import * as appSaga from './sagas/appSaga';
import * as editorSaga from './sagas/editorSaga';

const rootSaga = function*() {
  yield all([
    // Home Sagas
    spawn(homeSaga.watchFetchDiscussions),
    spawn(homeSaga.watchFetchMoreDiscussions),
    spawn(homeSaga.watchFetchTags),

    // Post Sagas
    spawn(postSaga.watchFetchComments),

    // User Sagas
    spawn(usersSaga.watchFetchUser),
    spawn(usersSaga.watchFetchUserBlog),
    spawn(usersSaga.watchFetchUserComments),
    spawn(usersSaga.watchFetchUserFollowCount),
    spawn(usersSaga.watchRefreshUserBlog),

    // Search Sagas
    spawn(searchSaga.watchSearchAskSteem),
    spawn(searchSaga.watchSearchFetchPostDetails),

    // Current User Sagas
    spawn(currentUserSaga.watchFetchCurrentUserFeed),
    spawn(currentUserSaga.watchFetchMoreCurrentUserFeed),
    spawn(currentUserSaga.watchCurrentUserVotePost),
    spawn(currentUserSaga.watchCurrentUserReblogPost),
    spawn(currentUserSaga.watchCurrentUserOnboarding),
    spawn(currentUserSaga.watchCurrentUserFollowList),
    spawn(currentUserSaga.watchCurrentUserFollowUser),
    spawn(currentUserSaga.watchCurrentuserUnfollowUser),

    // User Activity Sagas
    spawn(userActivitySaga.watchFetchUserAccountHistory),
    spawn(userActivitySaga.watchFetchMoreUserAccountHistory),

    // App Saga
    spawn(appSaga.watchFetchSteemGlobalProperties),
    spawn(appSaga.watchFetchSteemRate),
    spawn(appSaga.watchFetchNetworkConnection),
    spawn(appSaga.watchSetTranslations),

    // Editor Saga
    spawn(editorSaga.watchCreatePost),
    spawn(editorSaga.watchUploadImage),
  ]);
};

export default rootSaga;
