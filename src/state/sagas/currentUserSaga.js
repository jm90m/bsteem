import _ from 'lodash';
import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import API from 'api/api';
import sc2 from 'api/sc2';
import { getAuthUsername, getCurrentUserFeed } from '../rootReducer';
import {
  FETCH_CURRENT_USER_FEED,
  FETCH_MORE_CURRENT_USER_FEED,
  CURRENT_USER_VOTE_POST,
  CURRENT_USER_REBLOG_POST,
  CURRENT_USER_ONBOARDING,
} from '../actions/actionTypes';
import * as currentUserActions from '../actions/currentUserActions';

const fetchCurrentUserFeed = function*() {
  try {
    const currentUsername = yield select(getAuthUsername);
    const query = {
      tag: currentUsername,
      limit: 10,
    };
    const result = yield call(API.getDiscussionsByFeed, query);
    yield put(currentUserActions.currentUserFeedFetch.success(result));
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
    yield put(currentUserActions.currentUserFeedFetchMore.success(result));
  } catch (error) {
    yield put(currentUserActions.currentUserFeedFetchMore.fail(error));
  }
};

const votePost = function*(action) {
  try {
    const { postAuthor, postPermlink, voteWeight, voteSuccessCallback } = action.payload;
    const currentUsername = yield select(getAuthUsername);
    const result = yield call(sc2.vote, currentUsername, postAuthor, postPermlink, voteWeight);
    voteSuccessCallback();
    yield put(currentUserActions.currentUserVotePost.success(result));
  } catch (error) {
    console.log('FAIL VOTE', error);
    const { voteFailCallback } = action.payload;
    voteFailCallback();
    yield put(currentUserActions.currentUserVotePost.fail(error));
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
    yield put(currentUserActions.currentUserReblogPost.success(payload));
  } catch (error) {
    const { reblogFailCallback } = action.payload;
    console.log('REBLOG FAIL', error);
    reblogFailCallback();
    yield put(currentUserActions.currentUserReblogPost.fail(error));
  }
};

const fetchCurrentUserRebloggedList = function*() {
  try {
    const currentUsername = yield select(getAuthUsername);
  } catch (error) {
    yield put(currentUserActions.currentUserReblogListFetch.fail(error));
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
  yield takeLatest(CURRENT_USER_VOTE_POST.ACTION, votePost);
};

export const watchCurrentUserReblogPost = function*() {
  yield takeLatest(CURRENT_USER_REBLOG_POST.ACTION, reblogPost);
};

export const watchCurrentUserOnboarding = function*() {
  yield takeLatest(CURRENT_USER_ONBOARDING.ACTION, currentUserOnboarding);
};
