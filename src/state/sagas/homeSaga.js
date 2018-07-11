import { takeLatest, call, put } from 'redux-saga/effects';
import API, { getAPIByFilter } from 'api/api';
import { FETCH_TAGS, FETCH_DISCUSSIONS, FETCH_MORE_DISCUSSIONS } from '../actions/actionTypes';
import {
  fetchTagsSuccess,
  fetchTagsFail,
  fetchDiscussionsSuccess,
  fetchDiscussionsFail,
  fetchMoreDiscussionsSuccess,
  fetchMoreDiscussionsFail,
} from '../actions/homeActions';
import { addPostsToPostMap } from '../actions/postsActions';

const fetchTags = function*() {
  try {
    const result = yield call(API.getTags);

    if (result.error) {
      yield put(fetchTagsFail(result.error));
    } else {
      yield put(fetchTagsSuccess(result.result));
    }
  } catch (error) {
    yield put(fetchTagsFail(error));
  }
};

const fetchDiscussions = function*(action) {
  try {
    const { filter } = action.payload;
    const query = { limit: 10 };
    const api = getAPIByFilter(filter.id);
    const result = yield call(api, query);
    if (result.error) {
      yield put(fetchDiscussionsFail(result.error));
    } else {
      yield put(fetchDiscussionsSuccess(result.result));
      yield put(addPostsToPostMap(result.result));
    }
  } catch (error) {
    yield put(fetchDiscussionsFail(error));
  }
};

const fetchMoreDiscussions = function*(action) {
  try {
    const { startAuthor, startPermlink, filter } = action.payload;
    const query = {
      limit: 11,
      start_author: startAuthor,
      start_permlink: startPermlink,
    };
    const api = getAPIByFilter(filter.id);
    const result = yield call(api, query);

    if (result.error) {
      yield put(fetchMoreDiscussionsFail(result.error));
    } else {
      yield put(fetchMoreDiscussionsSuccess(result.result));
      yield put(addPostsToPostMap(result.result));
    }
  } catch (error) {
    yield put(fetchMoreDiscussionsFail(error));
  }
};

export const watchFetchTags = function*() {
  yield takeLatest(FETCH_TAGS.PENDING, fetchTags);
};

export const watchFetchDiscussions = function*() {
  yield takeLatest(FETCH_DISCUSSIONS.PENDING, fetchDiscussions);
};

export const watchFetchMoreDiscussions = function*() {
  yield takeLatest(FETCH_MORE_DISCUSSIONS.PENDING, fetchMoreDiscussions);
};
