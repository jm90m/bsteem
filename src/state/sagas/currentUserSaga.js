import Expo from 'expo';
import _ from 'lodash';
import { takeLatest, all, call, put, select, takeEvery } from 'redux-saga/effects';
import API, { getAPIByFilter } from 'api/api';
import sc2 from 'api/sc2';
import {
  getFirebaseValueOnce,
  getUserRebloggedPostsRef,
  getRebloggedPostRef,
  setFirebaseData,
} from 'util/firebaseUtils';
import { VOTE_ERRORS, GENERIC_ERROR } from 'constants/errors';
import {
  getAuthUsername,
  getCurrentUserFeed,
  getCommentsByPostId,
  getSavedTags,
  getCurrentUserBSteemFeed,
} from '../rootReducer';
import {
  FETCH_CURRENT_USER_FEED,
  FETCH_MORE_CURRENT_USER_FEED,
  CURRENT_USER_VOTE_POST,
  CURRENT_USER_VOTE_COMMENT,
  CURRENT_USER_REBLOG_POST,
  CURRENT_USER_ONBOARDING,
  FETCH_CURRENT_USER_FOLLOW_LIST,
  CURRENT_USER_FOLLOW_USER,
  CURRENT_USER_UNFOLLOW_USER,
  FETCH_CURRENT_USER_REBLOG_LIST,
  FETCH_CURRENT_USER_BSTEEM_FEED,
  FETCH_MORE_CURRENT_USER_BSTEEM_FEED,
} from '../actions/actionTypes';
import * as currentUserActions from '../actions/currentUserActions';
import { displayNotifyModal } from '../actions/appActions';
import { refreshUserBlog } from '../actions/usersActions';

const fetchCurrentUserFeed = function*() {
  try {
    const currentUsername = yield select(getAuthUsername);
    const query = {
      tag: currentUsername,
      limit: 10,
    };
    const result = yield call(API.getDiscussionsByFeed, query);
    if (result.error) {
      yield put(currentUserActions.currentUserFeedFetch.fail(result.error));
    } else {
      yield put(currentUserActions.currentUserFeedFetch.success(result.result));
    }
  } catch (error) {
    yield put(currentUserActions.currentUserFeedFetch.fail(error));
  }
};

const fetchMoreCurrentUserFeed = function*() {
  try {
    const currentUsername = yield select(getAuthUsername);
    const currentUserFeed = yield select(getCurrentUserFeed);
    const lastPost = _.last(currentUserFeed);
    const author = _.get(lastPost, 'author', '');
    const permlink = _.get(lastPost, 'permlink', '');
    const query = {
      tag: currentUsername,
      limit: 10,
      start_author: author,
      start_permlink: permlink,
    };
    const result = yield call(API.getDiscussionsByFeed, query);
    if (result.error) {
      yield put(currentUserActions.currentUserFeedFetchMore.fail(result.error));
    } else {
      yield put(currentUserActions.currentUserFeedFetchMore.success(result.result));
    }
  } catch (error) {
    yield put(currentUserActions.currentUserFeedFetchMore.fail(error));
  }
};

const fetchFeedforBSteem = function*(tag, limit, filter, extraQueryParams = {}) {
  try {
    const api = getAPIByFilter(filter);
    const query = {
      tag,
      limit,
      ...extraQueryParams,
    };
    const result = yield call(api, query);
    if (result.error) {
      return [];
    }
    return result.result;
  } catch (e) {
    return [];
  }
};

const fetchCurrentUserBSteemFeed = function*(action) {
  try {
    const { filter } = action.payload;
    const savedTags = yield select(getSavedTags);
    const limit = _.size(savedTags) >= 10 ? 1 : 3;

    let bsteemFeed = [];

    const tagResults = yield all(
      savedTags.map(tag => call(fetchFeedforBSteem, tag, limit, filter)),
    );

    bsteemFeed = _.unionBy(bsteemFeed, _.flatten(tagResults), 'id');

    yield put(currentUserActions.currentUserBSteemFeedFetch.success(bsteemFeed));
  } catch (error) {
    console.log(error);
    yield put(currentUserActions.currentUserBSteemFeedFetch.fail(error));
  }
};

const fetchMoreCurrentUserBSteemFeed = function*(action) {
  try {
    const { filter } = action.payload;
    const currentUserBSteemFeed = yield select(getCurrentUserBSteemFeed);
    const randomIndex = Math.floor(Math.random() * _.size(currentUserBSteemFeed));
    const randomPost = _.get(currentUserBSteemFeed, randomIndex, _.last(currentUserBSteemFeed));
    const tag = _.get(randomPost, 'category');
    const author = _.get(randomPost, 'author', '');
    const permlink = _.get(randomPost, 'permlink', '');
    const limit = 20;
    const extraQueryParams = {
      start_author: author,
      start_permlink: permlink,
    };

    const tagResults = yield call(fetchFeedforBSteem, tag, limit, filter, extraQueryParams);

    yield put(currentUserActions.currentUserBSteemFeedFetchMore.success(tagResults));
  } catch (error) {
    yield put(currentUserActions.currentUserBSteemFeedFetchMore.fail(error));
  }
};

const votePost = function*(action) {
  try {
    const { postAuthor, postPermlink, voteWeight, voteSuccessCallback } = action.payload;
    const currentUsername = yield select(getAuthUsername);
    const result = yield call(sc2.vote, currentUsername, postAuthor, postPermlink, voteWeight);
    voteSuccessCallback(voteWeight);
    yield put(currentUserActions.currentUserVotePost.success(result));
  } catch (error) {
    const errorDescription = _.get(error, 'error_description', '');
    const errorDetails = _.find(VOTE_ERRORS, voteError =>
      _.includes(errorDescription, voteError.fingerprint),
    );
    let displayedError = GENERIC_ERROR;

    if (!_.isEmpty(errorDetails)) {
      displayedError = errorDetails;
    }
    const displayErrorTitle = _.get(displayedError, 'title', GENERIC_ERROR.title);
    const displayErrorDescription = _.get(displayedError, 'description', GENERIC_ERROR.description);

    console.log('FAIL VOTE', errorDescription);
    const { voteFailCallback } = action.payload;
    voteFailCallback();
    yield put(displayNotifyModal(displayErrorTitle, displayErrorDescription));
    yield put(currentUserActions.currentUserVotePost.fail(error));
  }
};

const voteComment = function*(action) {
  try {
    const { commentId, postId, weight, voteSuccessCallback, commentData } = action.payload;
    const currentUsername = yield select(getAuthUsername);
    const commentsByPostId = yield select(getCommentsByPostId);
    const postCommentsDetails = _.get(commentsByPostId, postId, {});
    const comment = _.get(postCommentsDetails, `comments.${commentId}`, commentData);
    const { author, permlink } = comment;
    const result = yield call(sc2.vote, currentUsername, author, permlink, weight);

    voteSuccessCallback();
    yield put(currentUserActions.currentUserVoteComment.success(result));
  } catch (error) {
    const { voteFailCallback } = action.payload;
    console.log('FAIL VOTE COMMENT', error);
    voteFailCallback();
    yield put(currentUserActions.currentUserVoteComment.fail(error));
  }
};

const addRebloggedPostToFirebase = function*(postId) {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getRebloggedPostRef(userID, postId), postId);
  } catch (error) {
    console.log('failed to add reblog post on firebase');
  }
};

const reblogPost = function*(action) {
  try {
    const { postId, postAuthor, postPermlink, reblogSuccessCallback } = action.payload;
    const currentUsername = yield select(getAuthUsername);
    const result = yield call(sc2.reblog, currentUsername, postAuthor, postPermlink);
    reblogSuccessCallback();
    const payload = {
      postId,
    };
    console.log('REBLOG SUCCESS', result, payload);
    yield call(addRebloggedPostToFirebase, postId);
    yield put(currentUserActions.currentUserReblogPost.success(payload));
    yield put(refreshUserBlog.action({ username: currentUsername }));
  } catch (error) {
    const { reblogFailCallback } = action.payload;
    console.log('REBLOG FAIL', error);
    reblogFailCallback();
    yield put(currentUserActions.currentUserReblogPost.fail(error));
  }
};

const fetchCurrentUserRebloggedList = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;

    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserRebloggedPostsRef(userID), 'value');
    const result = snapshot.val() || {};
    const rebloggedPosts = _.map(result, (val, id) => id);
    yield put(currentUserActions.currentUserReblogListFetch.success(rebloggedPosts));
  } catch (error) {
    yield put(currentUserActions.currentUserReblogListFetch.fail(error));
  }
};

const fetchCurrentUserFollowList = function*() {
  try {
    const currentUsername = yield select(getAuthUsername);
    const result = yield call(API.getAllFollowing, currentUsername);
    yield put(currentUserActions.currentUserFollowListFetch.success(result));
  } catch (error) {
    console.log('FOLLOW LIST ERROR', error);
    yield put(currentUserActions.currentUserFollowListFetch.fail(error));
  }
};

const followUser = function*(action) {
  try {
    const { username, followSuccessCallback } = action.payload;
    const currentUsername = yield select(getAuthUsername);
    const result = yield call(sc2.follow, currentUsername, username);
    const payload = {
      username,
    };
    followSuccessCallback();
    console.log('FOLLOW SUCCESS', result, payload);
    yield put(currentUserActions.currentUserFollowUser.success(payload));
  } catch (error) {
    const { followFailCallback } = action.payload;
    followFailCallback();
    console.log('FOLLOW FAIL', error);
    yield put(currentUserActions.currentUserFollowUser.fail(error));
  }
};

const unfollowUser = function*(action) {
  try {
    const { username, unfollowSuccessCallback } = action.payload;
    const currentUsername = yield select(getAuthUsername);
    const result = yield call(sc2.unfollow, currentUsername, username);
    const payload = {
      username,
    };
    unfollowSuccessCallback();
    console.log('UNFOLLOW SUCCESS', result, payload);
    yield put(currentUserActions.currentUserUnfollowUser.success(payload));
  } catch (error) {
    console.log('UNFOLLOW FAIL', error);
    const { unfollowFailCallback } = action.payload;
    unfollowFailCallback();
    yield put(currentUserActions.currentUserUnfollowUser.fail(error));
  }
};

const currentUserOnboarding = function*() {
  try {
    yield all([call(fetchCurrentUserFeed), call(fetchCurrentUserRebloggedList)]);
    yield put(currentUserActions.currentUserOnboarding.success());
  } catch (error) {
    console.log('FAILED_CURRENT_USER_ONBOARDING', error);
    yield put(currentUserActions.currentUserOnboarding.fail());
  }
};

export const watchFetchCurrentUserFeed = function*() {
  yield takeLatest(FETCH_CURRENT_USER_FEED.ACTION, fetchCurrentUserFeed);
};

export const watchFetchMoreCurrentUserFeed = function*() {
  yield takeLatest(FETCH_MORE_CURRENT_USER_FEED.ACTION, fetchMoreCurrentUserFeed);
};

export const watchCurrentUserVotePost = function*() {
  yield takeEvery(CURRENT_USER_VOTE_POST.ACTION, votePost);
};

export const watchCurrentUserVoteComment = function*() {
  yield takeEvery(CURRENT_USER_VOTE_COMMENT.ACTION, voteComment);
};

export const watchCurrentUserReblogPost = function*() {
  yield takeEvery(CURRENT_USER_REBLOG_POST.ACTION, reblogPost);
};

export const watchCurrentUserOnboarding = function*() {
  yield takeLatest(CURRENT_USER_ONBOARDING.ACTION, currentUserOnboarding);
};

export const watchCurrentUserFollowList = function*() {
  yield takeEvery(FETCH_CURRENT_USER_FOLLOW_LIST.ACTION, fetchCurrentUserFollowList);
};

export const watchCurrentUserFollowUser = function*() {
  yield takeEvery(CURRENT_USER_FOLLOW_USER.ACTION, followUser);
};

export const watchCurrentUserUnfollowUser = function*() {
  yield takeEvery(CURRENT_USER_UNFOLLOW_USER.ACTION, unfollowUser);
};

export const watchFetchCurrentUserRebloggedList = function*() {
  yield takeLatest(FETCH_CURRENT_USER_REBLOG_LIST.ACTION, fetchCurrentUserRebloggedList);
};

export const watchFetchCurrentUserBSteemFeed = function*() {
  yield takeLatest(FETCH_CURRENT_USER_BSTEEM_FEED.ACTION, fetchCurrentUserBSteemFeed);
};

export const watchFetchMoreCurrentUserBsteemFeed = function*() {
  yield takeLatest(FETCH_MORE_CURRENT_USER_BSTEEM_FEED.ACTION, fetchMoreCurrentUserBSteemFeed);
};
