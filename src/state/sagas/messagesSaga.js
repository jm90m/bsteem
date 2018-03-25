import _ from 'lodash';
import { takeLatest, all, call, put, select, takeEvery } from 'redux-saga/effects';
import API from 'api/api';
import { getFirebaseValueOnce, getUserAllPrivateMessagesRef } from 'util/firebaseUtils';
import { FETCH_MESSAGES, SEARCH_USER_MESSAGES, SEND_MESSAGE } from '../actions/actionTypes';
import * as firebaseActions from '../actions/firebaseActions';
import { getAuthUsername } from '../rootReducer';

const fetchMessages = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    const snapshot = yield call(
      getFirebaseValueOnce,
      getUserAllPrivateMessagesRef(authUsername),
      'value',
    );
    const messages = snapshot.val() || {};
    yield put(firebaseActions.fetchMessages.success(messages));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchMessages.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchMessages.loadingEnd());
  }
};

const searchUserMessages = function*(action) {
  try {
    const search = action.payload;
    const response = yield call(API.getAccountReputation, search, 5);
    const usersResult = _.map(response.result, user => ({
      ...user,
      type: 'user',
      name: user.account,
    }));
    console.log(usersResult, response);
    yield put(firebaseActions.searchUserMessages.success(usersResult));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.searchUserMessages.fail(error));
  } finally {
    yield put(firebaseActions.searchUserMessages.loadingEnd());
  }
};

const sendMessage = function*(action) {
  try {
    const { username, text, successCallback } = action.payload;
    const currentTimestamp = new Date().getTime();
    
  } catch (error) {

  }
};

export const watchFetchMessages = function*() {
  yield takeEvery(FETCH_MESSAGES.ACTION, fetchMessages);
};

export const watchSearchUserMessages = function*() {
  yield takeLatest(SEARCH_USER_MESSAGES.ACTION, searchUserMessages);
};

export const watchSendMessage = function*() {
  yield takeLatest(SEND_MESSAGE.ACTION, sendMessage);
};
