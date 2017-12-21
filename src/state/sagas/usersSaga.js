import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';
import API from 'api/api';
import {
  FETCH_USER,
  FETCH_USER_COMMENTS,
  FETCH_USER_BLOG,
  FETCH_USER_FOLLOW_COUNT,
  FETCH_ALL_USER_DETAILS,
} from 'state/actions/actionTypes';
import * as userActions from 'state/actions/usersActions';

const fetchUser = function*(action) {
  try {
    const { username } = action.payload;
    const result = yield call(API.getAccount, username);
    yield put(userActions.fetchUser.success(result));
  } catch (error) {
    yield put(userActions.fetchUser.fail(error));
  }
};

const fetchUserBlog = function*(action) {
  try {
    const { username, query } = action.payload;
    const result = yield call(API.getDiscussionsByBlog, query);
    console.log('FETCH USER BLOG', username, query);
    const payload = {
      result,
      username,
    };
    yield put(userActions.fetchUserBlog.success(payload));
  } catch (error) {
    console.log('FETCH USER BLOG FAIL', error);
    yield put(userActions.fetchUserBlog.fail(error));
  } finally {
    yield put(userActions.fetchUserBlog.loadingEnd());
  }
};

const fetchUserComments = function*(action) {
  try {
    const { username, query } = action.payload;
    const result = yield call(API.getDiscussionsByComments, query);
    const payload = {
      result,
      username,
    };
    yield put(userActions.fetchUserComments.success(payload));
  } catch (error) {
    yield put(userActions.fetchUserComments.fail(error));
  } finally {
    yield put(userActions.fetchUserComments.loadingEnd());
  }
};

const fetchUserFollowCount = function*(action) {
  try {
    const { username } = action.payload;
    const result = yield call(API.getFollowCount, username);
    const payload = {
      result,
      username,
    };
    yield put(userActions.fetchUserFollowCount.success(payload));
  } catch (error) {
    yield put(userActions.fetchUserFollowCount.fail(error));
  }
};

const fetchAllUserDetails = function*(action) {
  try {
    // const { username } = action.payload;
    // yield all([
    //   call(fetchUserComments({ }))
    // ])
  } catch (error) {}
};

export const watchFetchUser = function*() {
  yield takeLatest(FETCH_USER.ACTION, fetchUser);
};

export const watchFetchUserComments = function*() {
  yield takeLatest(FETCH_USER_COMMENTS.ACTION, fetchUserComments);
};

export const watchFetchUserBlog = function*() {
  yield takeLatest(FETCH_USER_BLOG.ACTION, fetchUserBlog);
};

export const watchFetchUserFollowCount = function*() {
  yield takeLatest(FETCH_USER_FOLLOW_COUNT.ACTION, fetchUserFollowCount);
};

export const watchFetchAllUserDetails = function*() {
  yield takeLatest(FETCH_ALL_USER_DETAILS.ACTION, fetchAllUserDetails);
};
