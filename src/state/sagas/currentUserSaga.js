import _ from 'lodash';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import API from 'api/api';
import { getAuthUsername, getCurrentUserFeed } from '../rootReducer';
import { FETCH_CURRENT_USER_FEED, FETCH_MORE_CURRENT_USER_FEED } from '../actions/actionTypes';
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

export const watchFetchCurrentUserFeed = function*() {
  yield takeLatest(FETCH_CURRENT_USER_FEED.ACTION, fetchCurrentUserFeed);
};

export const watchFetchMoreCurrentUserFeed = function*() {
  yield takeLatest(FETCH_MORE_CURRENT_USER_FEED.ACTION, fetchMoreCurrentUserFeed);
};
